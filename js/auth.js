// auth.js - UPDATED for separate signup/login pages
import { auth, db } from './firebase-config.js';

// Demo accounts for testing
const DEMO_ACCOUNTS = [
    { email: "luke@jedi.com", password: "force123", name: "Luke Skywalker" },
    { email: "leia@rebel.com", password: "princess123", name: "Princess Leia" },
    { email: "han@falcon.com", password: "nerf123", name: "Han Solo" },
    { email: "darth@sith.com", password: "vader123", name: "Darth Vader" },
    { email: "yoda@jedi.com", password: "master123", name: "Master Yoda" },
    { email: "obiwan@jedi.com", password: "hello123", name: "Obi-Wan Kenobi" }
];

// Common utility functions
function showMessage(message, type = 'error') {
    // Check which page we're on
    let container;
    if (document.querySelector('.signup-container')) {
        container = document.querySelector('.signup-container');
    } else if (document.querySelector('.login-container')) {
        container = document.querySelector('.login-container');
    } else {
        // Fallback to alert
        alert(message);
        return;
    }
    
    const existingMsg = document.querySelector('.message');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = message;
    
    const buttons = container.querySelectorAll('button');
    if (buttons.length > 0) {
        container.insertBefore(msgDiv, buttons[0]);
    } else {
        container.appendChild(msgDiv);
    }
    
    if (type !== 'error') {
        setTimeout(() => msgDiv.remove(), 5000);
    }
}

function resetButton(button, originalText) {
    if (button) {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// Handle user registration (for signup.html)
async function handleSignUp() {
    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<span class="spinner"></span>';
    button.disabled = true;
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const displayName = document.getElementById('displayName')?.value.trim() || '';
    const avatar = document.getElementById('avatar')?.value.trim() || '';
    
    if (!email || !password) {
        showMessage('Please enter email and password');
        resetButton(button, originalText);
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters');
        resetButton(button, originalText);
        return;
    }
    
    try {
        // Check if using demo account
        const demoAccount = DEMO_ACCOUNTS.find(acc => acc.email === email);
        if (demoAccount) {
            showMessage('This is a demo account. Please use "AUTHORIZE ENTRY" on login page.');
            resetButton(button, originalText);
            return;
        }
        
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            displayName: displayName || email.split('@')[0],
            avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            uid: user.uid,
            createdAt: new Date(),
            online: true,
            theme: 'light'
        });
        
        // Store user ID in localStorage
        localStorage.setItem('uid', user.uid);
        localStorage.setItem('userEmail', email);
        if (displayName) {
            localStorage.setItem('userName', displayName);
        }
        
        showMessage('Registration successful! Redirecting...', 'success');
        
        // Redirect to chat
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Signup error:', error);
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                showMessage('Email already registered. Please login.');
                break;
            case 'auth/invalid-email':
                showMessage('Invalid email format.');
                break;
            case 'auth/weak-password':
                showMessage('Password is too weak.');
                break;
            default:
                showMessage(`Error: ${error.message}`);
        }
        resetButton(button, originalText);
    }
}

// Handle user login (for login.html)
async function handleLogin() {
    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<span class="spinner"></span>';
    button.disabled = true;
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!email || !password) {
        showMessage('Please enter email and password');
        resetButton(button, originalText);
        return;
    }
    
    try {
        // Check if it's a demo account
        const demoAccount = DEMO_ACCOUNTS.find(acc => acc.email === email);
        
        if (demoAccount) {
            if (password !== demoAccount.password) {
                showMessage('Incorrect password for demo account');
                resetButton(button, originalText);
                return;
            }
            
            // Create demo user session
            const demoUid = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('uid', demoUid);
            localStorage.setItem('userEmail', demoAccount.email);
            localStorage.setItem('userName', demoAccount.name);
            localStorage.setItem('userAvatar', `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoAccount.name}`);
            localStorage.setItem('isDemo', 'true');
            
            showMessage(`Welcome ${demoAccount.name}! (Demo Mode)`, 'success');
            
            // Redirect to chat
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            return;
        }
        
        // Regular Firebase login
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Store user ID in localStorage
        localStorage.setItem('uid', user.uid);
        localStorage.setItem('userEmail', email);
        
        // Update user status
        await db.collection('users').doc(user.uid).update({
            online: true,
            lastLogin: new Date()
        });
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to chat
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        
        switch(error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                showMessage('Invalid email or password.');
                break;
            case 'auth/user-disabled':
                showMessage('Account has been disabled.');
                break;
            default:
                showMessage(`Error: ${error.message}`);
        }
        resetButton(button, originalText);
    }
}

// Fill demo account for signup page
function fillDemoAccount(email, password, name = '') {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameInput = document.getElementById('displayName');
    
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;
    if (nameInput && name) nameInput.value = name;
    
    showMessage(`Demo account loaded. ${nameInput ? 'Click "REGISTER PILOT" to create a similar account.' : 'Click "AUTHORIZE ENTRY" to login.'}`, 'success');
}

// Auto-focus and Enter key handling based on page
document.addEventListener('DOMContentLoaded', () => {
    // Auto-focus email input
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
    
    // Setup Enter key for password field on login page
    const passwordInput = document.getElementById('password');
    if (passwordInput && document.querySelector('.login-container')) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
    
    // Setup Enter key for avatar field on signup page
    const avatarInput = document.getElementById('avatar');
    if (avatarInput && document.querySelector('.signup-container')) {
        avatarInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSignUp();
            }
        });
    }
});

// Make functions globally available
window.handleSignUp = handleSignUp;
window.handleLogin = handleLogin;
window.fillDemoAccount = fillDemoAccount;
window.showMessage = showMessage;
