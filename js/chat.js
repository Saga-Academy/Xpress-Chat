// chat.js - Complete chat functionality

// Demo messages storage
const DEMO_MESSAGES = [
    {
        id: 'msg1',
        text: "Welcome to the Galactic Chat!",
        senderName: "System",
        senderAvatar: "https://static.wikia.nocookie.net/starwars/images/6/6f/Yoda_SWSB.png",
        timestamp: new Date(Date.now() - 3600000),
        type: 'system'
    },
    {
        id: 'msg2',
        text: "The force is strong with this chat.",
        senderName: "Luke Skywalker",
        senderAvatar: "https://static.wikia.nocookie.net/starwars/images/2/20/LukeTLJ.jpg",
        timestamp: new Date(Date.now() - 1800000),
        type: 'character'
    },
    {
        id: 'msg3',
        text: "I find your lack of faith disturbing.",
        senderName: "Darth Vader",
        senderAvatar: "https://static.wikia.nocookie.net/starwars/images/0/0b/Vader.jpg",
        timestamp: new Date(Date.now() - 900000),
        type: 'character'
    },
    {
        id: 'msg4',
        text: "Never tell me the odds!",
        senderName: "Han Solo",
        senderAvatar: "https://static.wikia.nocookie.net/starwars/images/6/67/HanSolo.jpg",
        timestamp: new Date(Date.now() - 600000),
        type: 'character'
    }
];

// Star Wars character responses
const STAR_WARS_RESPONSES = [
    {
        name: "Luke Skywalker",
        avatar: "https://static.wikia.nocookie.net/starwars/images/2/20/LukeTLJ.jpg",
        responses: [
            "The force is strong with this one.",
            "I'll never turn to the dark side.",
            "I am a Jedi, like my father before me.",
            "The force will be with you, always."
        ]
    },
    {
        name: "Darth Vader",
        avatar: "https://static.wikia.nocookie.net/starwars/images/0/0b/Vader.jpg",
        responses: [
            "I find your lack of faith disturbing.",
            "The force is strong with you.",
            "I am your father.",
            "The circle is now complete."
        ]
    },
    {
        name: "Yoda",
        avatar: "https://static.wikia.nocookie.net/starwars/images/6/6f/Yoda_SWSB.png",
        responses: [
            "Do or do not. There is no try.",
            "Fear is the path to the dark side.",
            "The greatest teacher, failure is.",
            "Size matters not."
        ]
    },
    {
        name: "Han Solo",
        avatar: "https://static.wikia.nocookie.net/starwars/images/6/67/HanSolo.jpg",
        responses: [
            "Never tell me the odds!",
            "I've got a bad feeling about this.",
            "You know, sometimes I amaze even myself.",
            "It's the ship that made the Kessel Run in less than twelve parsecs."
        ]
    },
    {
        name: "Princess Leia",
        avatar: "https://static.wikia.nocookie.net/starwars/images/1/1b/LeiaOrganaheadshot.jpg",
        responses: [
            "Help me Obi-Wan Kenobi, you're my only hope.",
            "Aren't you a little short for a stormtrooper?",
            "Somebody has to save our skins.",
            "I'd just as soon kiss a Wookiee."
        ]
    },
    {
        name: "Obi-Wan Kenobi",
        avatar: "https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg",
        responses: [
            "These aren't the droids you're looking for.",
            "The force will be with you, always.",
            "You were the chosen one!",
            "Hello there!"
        ]
    },
    {
        name: "Chewbacca",
        avatar: "https://static.wikia.nocookie.net/starwars/images/4/48/Chewbacca_TLJ.png",
        responses: [
            "*Angry Wookiee noises*",
            "*Happy Wookiee growls*",
            "*Confused Wookiee sounds*",
            "*Excited Wookiee roar*"
        ]
    },
    {
        name: "C-3PO",
        avatar: "https://static.wikia.nocookie.net/starwars/images/3/3f/C-3PO_TLJ_Card_Trader_Award_Card.png",
        responses: [
            "We're doomed!",
            "R2-D2, where are you?",
            "I am fluent in over six million forms of communication.",
            "This is madness!"
        ]
    }
];

// Global variables
let demoMessages = [];
let isTyping = false;
let typingTimeout = null;

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!localStorage.getItem("uid")) {
        window.location.href = "login.html";
        return;
    }
    
    // Load demo messages
    loadDemoMessages();
    
    // Setup chat functionality
    setupChat();
    
    // Load initial messages
    setTimeout(() => {
        loadInitialMessages();
    }, 1000);
});

// Load demo messages from localStorage
function loadDemoMessages() {
    const storedMessages = localStorage.getItem('demoMessages');
    if (storedMessages) {
        demoMessages = JSON.parse(storedMessages);
    } else {
        // Initialize with demo messages
        demoMessages = DEMO_MESSAGES.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString()
        }));
        localStorage.setItem('demoMessages', JSON.stringify(demoMessages));
    }
}

// Setup chat functionality
function setupChat() {
    const messageInput = document.getElementById('msg');
    const sendButton = document.getElementById('sendButton');
    
    if (messageInput && sendButton) {
        // Send message on button click
        sendButton.addEventListener('click', sendMessage);
        
        // Send message on Enter key
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Typing indicator
        messageInput.addEventListener('input', function() {
            if (!isTyping) {
                isTyping = true;
                // In a real app, you would emit a typing event to server
            }
            
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                isTyping = false;
                // In a real app, you would emit a stop typing event
            }, 1000);
            
            // Simulate other users typing
            if (Math.random() > 0.7) {
                simulateTyping();
            }
        });
        
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            autoResize(this);
        });
    }
}

// Load initial messages
function loadInitialMessages() {
    const messagesContainer = document.getElementById('messages');
    const loadingDiv = messagesContainer.querySelector('.loading');
    
    if (loadingDiv) {
        loadingDiv.remove();
    }
    
    // Display demo messages
    demoMessages.forEach(message => {
        displayMessage(message);
    });
    
    // Scroll to bottom
    setTimeout(() => {
        scrollToBottom();
    }, 100);
}

// Display a message
function displayMessage(message) {
    const messagesContainer = document.getElementById('messages');
    
    // Convert timestamp string to Date object
    const timestamp = message.timestamp ? new Date(message.timestamp) : new Date();
    
    const messageDiv = document.createElement('div');
    
    // Check if message is from current user
    const isCurrentUser = message.senderName === localStorage.getItem('userName') ||
                         message.senderName === localStorage.getItem('userEmail')?.split('@')[0];
    
    messageDiv.className = `message ${isCurrentUser ? 'own' : ''} ${message.type === 'system' ? 'system' : ''}`;
    
    if (message.type === 'system') {
        messageDiv.innerHTML = `
            <div class="text">${escapeHtml(message.text)}</div>
            <div class="time">${formatTime(timestamp)}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            ${!isCurrentUser ? `
                <div class="message-header">
                    <img src="${message.senderAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}" 
                         class="message-avatar" alt="${message.senderName}">
                    <div class="sender">${escapeHtml(message.senderName)}</div>
                </div>
            ` : ''}
            <div class="text">${escapeHtml(message.text)}</div>
            <div class="time">${formatTime(timestamp)}</div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('msg');
    const text = messageInput.value.trim();
    
    if (!text) return;
    
    // Get current user info
    const currentUser = {
        uid: localStorage.getItem('uid'),
        name: localStorage.getItem('userName') || 'Pilot',
        avatar: localStorage.getItem('userAvatar') || 
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('uid')}`
    };
    
    // Create message object
    const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: text,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderId: currentUser.uid,
        timestamp: new Date().toISOString(),
        type: 'user'
    };
    
    // Display message immediately
    displayMessage(message);
    
    // Add to demo messages
    demoMessages.push(message);
    localStorage.setItem('demoMessages', JSON.stringify(demoMessages));
    
    // Clear input
    messageInput.value = '';
    autoResize(messageInput);
    
    // Scroll to bottom
    scrollToBottom();
    
    // Simulate response after delay
    setTimeout(() => {
        simulateStarWarsResponse();
    }, 1000 + Math.random() * 2000);
}

// Simulate Star Wars character response
function simulateStarWarsResponse() {
    const randomCharacter = STAR_WARS_RESPONSES[Math.floor(Math.random() * STAR_WARS_RESPONSES.length)];
    const randomResponse = randomCharacter.responses[Math.floor(Math.random() * randomCharacter.responses.length)];
    
    const message = {
        id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: randomResponse,
        senderName: randomCharacter.name,
        senderAvatar: randomCharacter.avatar,
        timestamp: new Date().toISOString(),
        type: 'character'
    };
    
    // Add to demo messages
    demoMessages.push(message);
    localStorage.setItem('demoMessages', JSON.stringify(demoMessages));
    
    // Display message
    displayMessage(message);
    scrollToBottom();
}

// Simulate typing indicator
function simulateTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    const typingUser = document.getElementById('typingUser');
    
    if (!typingIndicator || !typingUser) return;
    
    const randomCharacter = STAR_WARS_RESPONSES[Math.floor(Math.random() * STAR_WARS_RESPONSES.length)];
    
    typingUser.textContent = `${randomCharacter.name} is typing...`;
    typingIndicator.style.display = 'flex';
    
    setTimeout(() => {
        typingIndicator.style.display = 'none';
    }, 2000 + Math.random() * 2000);
}

// Format time
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Auto-resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
}

// Scroll to bottom
function scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Escape HTML for security
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add system message
function addSystemMessage(text) {
    const messagesContainer = document.getElementById('messages');
    
    const message = {
        id: `sys_${Date.now()}`,
        text: text,
        senderName: 'System',
        timestamp: new Date().toISOString(),
        type: 'system'
    };
    
    demoMessages.push(message);
    localStorage.setItem('demoMessages', JSON.stringify(demoMessages));
    
    displayMessage(message);
    scrollToBottom();
}

// Update user profile (called from index.html)
function updateUserProfile(name, avatar) {
    if (name) {
        localStorage.setItem('userName', name);
        document.getElementById('userName').textContent = name;
    }
    
    if (avatar) {
        localStorage.setItem('userAvatar', avatar);
        document.getElementById('userAvatar').src = avatar;
    }
    
    // Update all user's messages with new name/avatar
    demoMessages.forEach((msg, index) => {
        if (msg.senderId === localStorage.getItem('uid')) {
            demoMessages[index] = {
                ...msg,
                senderName: name || msg.senderName,
                senderAvatar: avatar || msg.senderAvatar
            };
        }
    });
    
    localStorage.setItem('demoMessages', JSON.stringify(demoMessages));
    
    // Refresh messages display
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    loadInitialMessages();
}

// Make functions available globally
window.sendMessage = sendMessage;
window.addSystemMessage = addSystemMessage;
window.updateUserProfile = updateUserProfile;
window.autoResize = autoResize;
window.scrollToBottom = scrollToBottom;
