// js/auth.js
function login() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        initStorage();
        addUser(username);
        setCurrentUser(username);
        window.location.href = 'index.html';
    }
}