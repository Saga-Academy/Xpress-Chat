// Update the handleSignUp function in auth.js
async function handleSignUp() {
    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<span class="spinner"></span>';
    button.disabled = true;
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const displayName = document.getElementById('displayName')?.value.trim() || '';
    
    // Get selected avatar URL (from gallery or custom)
    let avatarUrl = window.selectedAvatarUrl || 
                   document.getElementById('customAvatarUrl')?.value.trim() || 
                   `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
    
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
        
        // For demo mode (no Firebase)
        const demoUid = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('uid', demoUid);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', displayName || email.split('@')[0]);
        localStorage.setItem('userAvatar', avatarUrl);
        localStorage.setItem('isDemo', 'true');
        
        showMessage('Registration successful! Redirecting...', 'success');
        
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

// Also update handleLogin to preserve avatars
async function handleLogin() {
    // ... existing code ...
    
    if (demoAccount) {
        // Create demo user session with avatar
        const demoUid = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('uid', demoUid);
        localStorage.setItem('userEmail', demoAccount.email);
        localStorage.setItem('userName', demoAccount.name);
        
        // Use a themed avatar for demo users
        const demoAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoAccount.name}&backgroundColor=${demoAccount.name.includes('Sith') ? 'ff4444' : '00aaff'}`;
        localStorage.setItem('userAvatar', demoAvatar);
        localStorage.setItem('isDemo', 'true');
        
        showMessage(`Welcome ${demoAccount.name}! (Demo Mode)`, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    // ... rest of login code ...
}
