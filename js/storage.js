// js/storage.js
const STORAGE_PREFIX = 'viber_clone_';

function getCurrentUser() {
    return localStorage.getItem(STORAGE_PREFIX + 'currentUser');
}

function setCurrentUser(user) {
    localStorage.setItem(STORAGE_PREFIX + 'currentUser', user);
}

function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'users')) || [];
}

function addUser(username) {
    let users = getUsers();
    if (!users.some(u => u.username === username)) {
        users.push({username, avatar: 'assets/avatar.png', online: true});
        localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
    }
}

function getChats(username) {
    return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'chats_' + username)) || [];
}

function addChat(username, other) {
    let chats = getChats(username);
    if (!chats.includes(other)) {
        chats.push(other);
        localStorage.setItem(STORAGE_PREFIX + 'chats_' + username, JSON.stringify(chats));
    }
    // Symmetric
    let otherChats = getChats(other);
    if (!otherChats.includes(username)) {
        otherChats.push(username);
        localStorage.setItem(STORAGE_PREFIX + 'chats_' + other, JSON.stringify(otherChats));
    }
}

function getChatId(u1, u2) {
    return [u1, u2].sort().join('_');
}

function getMessages(chatId) {
    return JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'messages_' + chatId)) || [];
}

function addMessage(chatId, message) {
    let messages = getMessages(chatId);
    message.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    messages.push(message);
    localStorage.setItem(STORAGE_PREFIX + 'messages_' + chatId, JSON.stringify(messages));
}

function deleteMessage(chatId, msgId) {
    let messages = getMessages(chatId);
    messages = messages.filter(m => m.id !== msgId);
    localStorage.setItem(STORAGE_PREFIX + 'messages_' + chatId, JSON.stringify(messages));
}

function initStorage() {
    if (!getUsers().length) {
        const defaultUsers = ['Alice', 'Bob', 'Charlie'];
        defaultUsers.forEach(addUser);
    }
}