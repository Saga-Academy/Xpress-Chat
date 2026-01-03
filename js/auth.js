// auth.js - Complete authentication system
const DEMO_ACCOUNTS = [
    { 
        email: "luke@jedi.com", 
        password: "force123", 
        name: "Luke Skywalker",
        avatar: "https://static.wikia.nocookie.net/starwars/images/2/20/LukeTLJ.jpg",
        faction: "Jedi"
    },
    { 
        email: "leia@rebel.com", 
        password: "princess123", 
        name: "Princess Leia",
        avatar: "https://static.wikia.nocookie.net/starwars/images/1/1b/LeiaOrganaheadshot.jpg",
        faction: "Rebel"
    },
    { 
        email: "han@falcon.com", 
        password: "nerf123", 
        name: "Han Solo",
        avatar: "https://static.wikia.nocookie.net/starwars/images/6/67/HanSolo.jpg",
        faction: "Rebel"
    },
    { 
        email: "darth@sith.com", 
        password: "vader123", 
        name: "Darth Vader",
        avatar: "https://static.wikia.nocookie.net/starwars/images/0/0b/Vader.jpg",
        faction: "Sith"
    },
    { 
        email: "yoda@jedi.com", 
        password: "master123", 
        name: "Master Yoda",
        avatar: "https://static.wikia.nocookie.net/starwars/images/6/6f/Yoda_SWSB.png",
        faction: "Jedi"
    },
    { 
        email: "obiwan@jedi.com", 
        password: "hello123", 
        name: "Obi-Wan Kenobi",
        avatar: "https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg",
        faction: "Jedi"
    },
    { 
        email: "orangewareph@gmail.com", 
        password: "donguardo888967", 
        name: "Orange Pilot",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=orange&backgroundColor=FFA500&hairColor=000000&accessories=glasses",
        faction: "Premium",
        isPremium: true,
        theme: 'orange'
    }
];

// Star Wars movie character avatars for signup
const STAR_WARS_AVATARS = [
    {
        id: 'luke',
        name: 'Luke Skywalker',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/2/20/LukeTLJ.jpg',
        faction: 'Jedi'
    },
    {
        id: 'leia',
        name: 'Princess Leia',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/1/1b/LeiaOrganaheadshot.jpg',
        faction: 'Rebel'
    },
    {
        id: 'han',
        name: 'Han Solo',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/6/67/HanSolo.jpg',
        faction: 'Rebel'
    },
    {
        id: 'vader',
        name: 'Darth Vader',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/0/0b/Vader.jpg',
        faction: 'Sith'
    },
    {
        id: 'yoda',
        name: 'Master Yoda',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/6/6f/Yoda_SWSB.png',
        faction: 'Jedi'
    },
    {
        id: 'obiwan',
        name: 'Obi-Wan Kenobi',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg',
        faction: 'Jedi'
    },
    {
        id: 'chewie',
        name: 'Chewbacca',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/4/48/Chewbacca_TLJ.png',
        faction: 'Rebel'
    },
    {
        id: 'r2d2',
        name: 'R2-D2',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/e/eb/ArtooTFA2-Fathead.png',
        faction: 'Droid'
    }
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
    
    // Get selected avatar (from gallery or custom)
    let avatarUrl = window.selectedAvatarUrl || 
                   document.getElementById('customAvatarUrl')?.value.trim() || 
                   STAR_WARS_AVATARS[0].avatar;
    
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
    
    if (email === "orangewareph@gmail.com") {
        showMessage('This email is reserved for Orange Pilot. Please use another email.');
        resetButton(button, originalText);
        return;
    }
    
    try {
        // Check if using demo account
        const demoAccount = DEMO_ACCOUNTS.find(acc => acc.email === email);
        if (demoAccount) {
            showMessage('This account already exists. Please login instead.');
            resetButton(button, originalText);
            return;
        }
        
        // For demo mode (no Firebase)
        const demoUid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('uid', demoUid);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', displayName || email.split('@')[0]);
        localStorage.setItem('userAvatar', avatarUrl);
        localStorage.setItem('isDemo', 'true');
        localStorage.setItem('theme', 'light');
        
        // Save to demo users list
        const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
        demoUsers.push({
            uid: demoUid,
            email: email,
            name: displayName || email.split('@')[0],
            avatar: avatarUrl,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
        
        showMessage('Registration successful! Welcome to the Star Wars chat!', 'success');
        
        // Redirect to chat
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Signup error:', error);
        showMessage(`Error: ${error.message}`);
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
        // Special handling for Orange Pilot account
        if (email === "orangewareph@gmail.com") {
            if (password !== "donguardo888967") {
                showMessage('Incorrect password for Orange Pilot account');
                resetButton(button, originalText);
                return;
            }
            
            showMessage('Welcome Orange Pilot! Premium features activated.', 'success');
            
            // Create demo user session with premium features
            const demoUid = `premium_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('uid', demoUid);
            localStorage.setItem('userEmail', 'orangewareph@gmail.com');
            localStorage.setItem('userName', 'Orange Pilot');
            localStorage.setItem('userAvatar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=orange&backgroundColor=FFA500&hairColor=000000&accessories=glasses');
            localStorage.setItem('isDemo', 'true');
            localStorage.setItem('isPremium', 'true');
            localStorage.setItem('premiumSince', new Date().toISOString());
            localStorage.setItem('theme', 'orange');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            return;
        }
        
        // Check demo accounts
        const demoAccount = DEMO_ACCOUNTS.find(acc => acc.email === email);
        
        if (demoAccount) {
            if (password !== demoAccount.password) {
                showMessage('Incorrect password');
                resetButton(button, originalText);
                return;
            }
            
            // Create demo user session
            const demoUid = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('uid', demoUid);
            localStorage.setItem('userEmail', demoAccount.email);
            localStorage.setItem('userName', demoAccount.name);
            localStorage.setItem('userAvatar', demoAccount.avatar);
            localStorage.setItem('isDemo', 'true');
            localStorage.setItem('theme', 'light');
            
            if (demoAccount.isPremium) {
                localStorage.setItem('isPremium', 'true');
                localStorage.setItem('theme', demoAccount.theme || 'orange');
            }
            
            showMessage(`Welcome ${demoAccount.name}!`, 'success');
            
            // Redirect to chat
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            return;
        }
        
        // Check registered users (from localStorage)
        const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
        const registeredUser = demoUsers.find(user => user.email === email);
        
        if (registeredUser) {
            // Simple password check (in real app, this would be hashed)
            if (password === 'user123' || password.length >= 6) {
                localStorage.setItem('uid', registeredUser.uid);
                localStorage.setItem('userEmail', registeredUser.email);
                localStorage.setItem('userName', registeredUser.name);
                localStorage.setItem('userAvatar', registeredUser.avatar);
                localStorage.setItem('isDemo', 'true');
                localStorage.setItem('theme', 'light');
                
                showMessage(`Welcome back ${registeredUser.name}!`, 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                return;
            } else {
                showMessage('Incorrect password');
                resetButton(button, originalText);
                return;
            }
        }
        
        // If no account found
        showMessage('Account not found. Please check your email or sign up.');
        resetButton(button, originalText);
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage(`Error: ${error.message}`);
        resetButton(button, originalText);
    }
}

// Fill demo account details
function fillDemoAccount(email, password, name = '') {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameInput = document.getElementById('displayName');
    
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;
    if (nameInput && name) nameInput.value = name;
    
    showMessage(`Credentials loaded for ${name}. Click "AUTHORIZE ENTRY" to login.`, 'success');
}

// Load Star Wars avatars for signup page
function loadStarWarsAvatars() {
    if (!document.querySelector('.avatar-gallery')) return;
    
    const gallery = document.querySelector('.avatar-gallery');
    gallery.innerHTML = '';
    
    STAR_WARS_AVATARS.forEach(avatar => {
        const div = document.createElement('div');
        div.className = 'avatar-option';
        div.title = avatar.name;
        div.innerHTML = `
            <img src="${avatar.avatar}" alt="${avatar.name}">
            <div class="avatar-label">${avatar.name}</div>
        `;
        
        div.addEventListener('click', () => {
            selectAvatar(avatar.avatar, avatar.name);
            document.querySelectorAll('.avatar-option').forEach(el => {
                el.classList.remove('selected');
            });
            div.classList.add('selected');
        });
        
        gallery.appendChild(div);
    });
}

// Select avatar
function selectAvatar(url, name) {
    const selectedAvatar = document.getElementById('selectedAvatar');
    const avatarName = document.getElementById('avatarName');
    
    if (selectedAvatar) selectedAvatar.src = url;
    if (avatarName) avatarName.textContent = name;
    
    // Store selected avatar
    window.selectedAvatarUrl = url;
}

// Switch avatar source
function switchAvatarSource(source) {
    const gallerySection = document.getElementById('avatarGallery');
    const customSection = document.getElementById('customAvatarSection');
    const generateSection = document.getElementById('generateAvatarSection');
    const buttons = document.querySelectorAll('.source-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (source === 'gallery') {
        gallerySection.style.display = 'grid';
        customSection.style.display = 'none';
        generateSection.style.display = 'none';
    } else if (source === 'custom') {
        gallerySection.style.display = 'none';
        customSection.style.display = 'flex';
        generateSection.style.display = 'none';
    } else if (source === 'generate') {
        gallerySection.style.display = 'none';
        customSection.style.display = 'none';
        generateSection.style.display = 'flex';
    }
}

// Use custom avatar URL
function useCustomAvatar() {
    const urlInput = document.getElementById('customAvatarUrl');
    const url = urlInput.value.trim();
    
    if (url) {
        if (isValidImageUrl(url)) {
            selectAvatar(url, 'Custom Avatar');
            showMessage('Custom avatar loaded successfully!', 'success');
        } else {
            showMessage('Please enter a valid image URL (jpg, png, gif, svg)', 'error');
        }
    } else {
        showMessage('Please enter an image URL', 'error');
    }
}

// Generate avatar from seed
function generateAvatar() {
    const seedInput = document.getElementById('generateSeed');
    const seed = seedInput.value.trim() || Date.now().toString();
    
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=00aaff`;
    selectAvatar(avatarUrl, `Generated: ${seed}`);
    showMessage('Avatar generated!', 'success');
}

// Validate image URL
function isValidImageUrl(url) {
    const pattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i;
    return pattern.test(url);
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (!passwordInput || !toggleIcon) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        toggleIcon.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Initialize on page load
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
        
        // Setup password toggle
        const toggleIcon = document.getElementById('togglePassword');
        if (toggleIcon) {
            toggleIcon.addEventListener('click', togglePasswordVisibility);
        }
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
    
    // Load Star Wars avatars on signup page
    if (document.querySelector('.signup-container')) {
        loadStarWarsAvatars();
        if (STAR_WARS_AVATARS.length > 0) {
            selectAvatar(STAR_WARS_AVATARS[0].avatar, STAR_WARS_AVATARS[0].name);
            document.querySelector('.avatar-option')?.classList.add('selected');
        }
    }
});

// Make functions globally available
window.handleSignUp = handleSignUp;
window.handleLogin = handleLogin;
window.fillDemoAccount = fillDemoAccount;
window.showMessage = showMessage;
window.selectAvatar = selectAvatar;
window.switchAvatarSource = switchAvatarSource;
window.useCustomAvatar = useCustomAvatar;
window.generateAvatar = generateAvatar;
window.togglePasswordVisibility = togglePasswordVisibility;
