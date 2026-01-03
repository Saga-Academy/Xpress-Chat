// chat.js - UPDATED
import { auth, db } from './firebase-config.js';

// DOM Elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('msg');
const sendButton = document.querySelector('.inputBar button');
const roomNameElement = document.getElementById('roomName');
const onlineCountElement = document.getElementById('onlineCount');

// Global variables
let currentUser = null;
let userProfile = null;
let unsubscribeMessages = null;
let unsubscribeOnline = null;
const roomId = 'main';

// Import Firebase services for serverTimestamp
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Initialize chat
async function initChat() {
    try {
        // Check if user is authenticated
        const uid = localStorage.getItem('uid');
        const isDemo = localStorage.getItem('isDemo') === 'true';
        
        if (!uid) {
            window.location.href = 'login.html';
            return;
        }
        
        if (isDemo) {
            // Setup demo user
            currentUser = {
                uid: uid,
                email: localStorage.getItem('userEmail'),
                displayName: localStorage.getItem('userName') || 'Demo Pilot',
                avatar: localStorage.getItem('userAvatar') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`
            };
            userProfile = currentUser;
            
            // Demo users don't need Firebase auth
            setupChat();
            return;
        }
        
        // Regular Firebase user
        currentUser = auth.currentUser;
        
        if (!currentUser) {
            // Try to sign in with stored UID
            try {
                // For simplicity, we'll redirect to login
                window.location.href = 'login.html';
                return;
            } catch (error) {
                console.error('Auth error:', error);
                window.location.href = 'login.html';
                return;
            }
        }
        
        // Load user profile from Firestore
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            userProfile = userDoc.data();
            
            // Apply saved theme
            if (userProfile.theme) {
                document.body.dataset.theme = userProfile.theme;
                localStorage.setItem('theme', userProfile.theme);
            }
            
            // Update online status
            await db.collection('users').doc(currentUser.uid).update({
                online: true,
                lastSeen: new Date()
            });
        } else {
            // Create profile if it doesn't exist
            userProfile = {
                displayName: currentUser.email?.split('@')[0] || 'User',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
                theme: 'light'
            };
            await db.collection('users').doc(currentUser.uid).set({
                ...userProfile,
                uid: currentUser.uid,
                email: currentUser.email,
                createdAt: new Date(),
                online: true
            });
        }
        
        setupChat();
        
    } catch (error) {
        console.error('Chat initialization error:', error);
        // If demo mode fails, still try to set up basic chat
        if (localStorage.getItem('isDemo')) {
            currentUser = {
                uid: localStorage.getItem('uid'),
                displayName: localStorage.getItem('userName') || 'Demo User',
                avatar: localStorage.getItem('userAvatar') || `https://api.dicebear.com/7.x/avataaars/svg?seed=demo`
            };
            userProfile = currentUser;
            setupChat();
        } else {
            alert('Failed to initialize chat. Please refresh or login again.');
        }
    }
}

// Setup chat functionality
function setupChat() {
    roomNameElement.textContent = 'CORUSCANT_CENTRAL';
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
    }
    
    loadMessages();
    setupOnlineUsers();
    setupMessageInput();
    setupVisibilityHandler();
    
    // Auto-scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
}

// Load and listen for messages
function loadMessages() {
    if (unsubscribeMessages) unsubscribeMessages();
    
    unsubscribeMessages = db.collection('messages')
        .where('roomId', '==', roomId)
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            // Clear messages container
            messagesContainer.innerHTML = '';
            
            snapshot.forEach((doc) => {
                displayMessage(doc.data());
            });
            
            // Scroll to bottom
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }, (error) => {
            console.error('Message listener error:', error);
            // Fallback for demo users or when Firebase fails
            if (localStorage.getItem('isDemo')) {
                displayDemoMessages();
            }
        });
}

// Display demo messages (fallback)
function displayDemoMessages() {
    const demoMessages = [
        {
            text: "Welcome to Galactic Chat!",
            senderName: "System",
            timestamp: { toDate: () => new Date(Date.now() - 300000) }
        },
        {
            text: "This is running in demo mode",
            senderName: "System",
            timestamp: { toDate: () => new Date(Date.now() - 240000) }
        },
        {
            text: "Try registering for full features!",
            senderName: "System",
            timestamp: { toDate: () => new Date(Date.now() - 180000) }
        }
    ];
    
    demoMessages.forEach(msg => displayMessage(msg));
}

// Display a single message
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    const isOwn = message.senderId === currentUser?.uid;
    messageDiv.className = `message ${isOwn ? 'own' : ''}`;
    
    const time = message.timestamp ? 
        new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
        'Just now';
    
    messageDiv.innerHTML = `
        ${!isOwn ? `<div class="sender">${message.senderName || 'Unknown'}</div>` : ''}
        <div class="text">${escapeHtml(message.text)}</div>
        <div class="time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
}

// Setup online users listener
function setupOnlineUsers() {
    if (localStorage.getItem('isDemo')) {
        // Demo mode: show random online count
        onlineCountElement.textContent = `Online: ${Math.floor(Math.random() * 20) + 5}`;
        return;
    }
    
    if (unsubscribeOnline) unsubscribeOnline();
    
    unsubscribeOnline = db.collection('users')
        .where('online', '==', true)
        .onSnapshot((snapshot) => {
            const onlineCount = snapshot.size;
            onlineCountElement.textContent = `Online: ${onlineCount}`;
        }, (error) => {
            console.error('Online users listener error:', error);
            onlineCountElement.textContent = 'Online: --';
        });
}

// Setup message input handling
function setupMessageInput() {
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    messageInput.focus();
}

// Send message function
async function sendMessage() {
    const text = messageInput.value.trim();
    
    if (!text) return;
    
    const originalButtonText = sendButton.textContent;
    messageInput.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = 'SENDING...';
    
    try {
        // For demo users, just display locally
        if (localStorage.getItem('isDemo')) {
            const demoMessage = {
                text: text,
                senderId: currentUser.uid,
                senderName: userProfile.displayName,
                senderAvatar: userProfile.avatar,
                roomId: roomId,
                timestamp: { toDate: () => new Date() }
            };
            
            // Add to messages locally
            displayMessage(demoMessage);
            messageInput.value = '';
            
            // Simulate receiving a response
            setTimeout(() => {
                const responses = [
                    "Roger that!",
                    "Copy that, pilot!",
                    "Message received loud and clear!",
                    "May the Force be with you!",
                    "I've got a bad feeling about this..."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                const responseMessage = {
                    text: randomResponse,
                    senderId: 'system_' + Date.now(),
                    senderName: 'System',
                    roomId: roomId,
                    timestamp: { toDate: () => new Date() }
                };
                
                displayMessage(responseMessage);
            }, 1000);
            
        } else {
            // Regular Firebase message
            const message = {
                text: text,
                senderId: currentUser.uid,
                senderName: userProfile.displayName || currentUser.email?.split('@')[0] || 'User',
                senderAvatar: userProfile.avatar,
                roomId: roomId,
                timestamp: new Date()
            };
            
            await db.collection('messages').add(message);
            messageInput.value = '';
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
    } finally {
        messageInput.disabled = false;
        sendButton.disabled = false;
        sendButton.textContent = originalButtonText;
        messageInput.focus();
    }
}

// Setup page visibility handler
function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', async () => {
        if (document.hidden && !localStorage.getItem('isDemo')) {
            await updateOnlineStatus(false);
        } else if (!document.hidden && !localStorage.getItem('isDemo')) {
            await updateOnlineStatus(true);
        }
    });
    
    window.addEventListener('beforeunload', async () => {
        if (!localStorage.getItem('isDemo')) {
            await updateOnlineStatus(false);
        }
    });
}

// Update user's online status
async function updateOnlineStatus(online) {
    if (!currentUser || localStorage.getItem('isDemo')) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            online: online,
            lastSeen: new Date()
        });
    } catch (error) {
        console.error('Error updating online status:', error);
    }
}

// Switch theme (Jedi/Sith)
async function switchSide(side) {
    document.body.dataset.theme = side;
    localStorage.setItem('theme', side);
    
    if (currentUser && !localStorage.getItem('isDemo')) {
        try {
            await db.collection('users').doc(currentUser.uid).update({
                theme: side
            });
            if (userProfile) userProfile.theme = side;
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }
}

// Logout function
async function logout() {
    try {
        if (!localStorage.getItem('isDemo')) {
            if (currentUser) {
                await updateOnlineStatus(false);
            }
            
            if (unsubscribeMessages) unsubscribeMessages();
            if (unsubscribeOnline) unsubscribeOnline();
            
            await auth.signOut();
        }
        
        // Clear all storage
        localStorage.removeItem('uid');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('isDemo');
        localStorage.removeItem('theme');
        
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = 'login.html';
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Override the placeholder functions
window.send = sendMessage;
window.switchSide = switchSide;
window.logout = logout;

// Initialize chat when page loads
window.addEventListener('DOMContentLoaded', initChat);

// Handle Firebase auth state changes (for non-demo users)
if (!localStorage.getItem('isDemo')) {
    auth.onAuthStateChanged((user) => {
        if (!user && window.location.pathname.endsWith('index.html')) {
            // If user is not logged in and not in demo mode, redirect to login
            window.location.href = 'login.html';
        }
    });
}
