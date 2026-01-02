// js/chat.js
document.addEventListener('DOMContentLoaded', () => {
    const current = getCurrentUser();
    if (!current) {
        window.location.href = 'login.html';
        return;
    }

    initStorage();
    document.getElementById('current-username').textContent = current;
    renderChatList('');

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => renderChatList(e.target.value.toLowerCase()));

    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    const emojis = ['😀', '😂', '❤️', '👍', '😎', '😢', '😡', '🎉', '🔥', '🌟'];
    emojiPicker.innerHTML = emojis.map(e => `<span onclick="insertEmoji('${e}')">${e}</span>`).join('');

    emojiBtn.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'flex' : 'none';
    });

    const sendBtn = document.getElementById('send-btn');
    sendBtn.addEventListener('click', sendMessage);

    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    const darkToggle = document.getElementById('dark-toggle');
    darkToggle.addEventListener('click', () => document.body.classList.toggle('dark'));
});

let currentChatUser = null;
let replyingTo = null;
let ws = null;

function insertEmoji(emoji) {
    const input = document.getElementById('message-input');
    input.value += emoji;
    document.getElementById('emoji-picker').style.display = 'none';
    input.focus();
}

function renderChatList(query) {
    const current = getCurrentUser();
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    let others = [];
    if (query) {
        others = getUsers().filter(u => u.username !== current && u.username.toLowerCase().includes(query)).map(u => u.username);
    } else {
        others = getChats(current);
    }
    const listItems = others.map(other => {
        const chatId = getChatId(current, other);
        const msgs = getMessages(chatId);
        const last = msgs[msgs.length - 1];
        const lastTime = last ? last.timestamp : 0;
        const lastMsg = last ? last.text.slice(0, 20) + (last.text.length > 20 ? '...' : '') : 'No messages yet';
        const timeStr = last ? new Date(last.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '';
        return {other, lastTime, lastMsg, timeStr};
    }).sort((a, b) => b.lastTime - a.lastTime);

    listItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('chat-item');
        div.innerHTML = `
            <img src="assets/avatar.png" alt="Avatar">
            <div class="chat-info">
                <span>${item.other}</span>
                <div class="chat-last-msg">${item.lastMsg}</div>
            </div>
            <div class="chat-time">${item.timeStr}</div>
        `;
        div.addEventListener('click', () => selectChat(item.other));
        chatList.appendChild(div);
    });
}

function selectChat(other) {
    const current = getCurrentUser();
    if (!getChats(current).includes(other)) {
        addChat(current, other);
    }
    currentChatUser = other;
    document.getElementById('chat-user').textContent = other;
    document.getElementById('online-status').textContent = 'online';
    document.getElementById('chat-panel').style.display = 'flex';
    loadMessages();
    renderChatList('');
    // Init mock ws
    ws = new MockWebSocket(current, other);
    ws.onmessage = handleWsMessage;
}

function loadMessages() {
    const current = getCurrentUser();
    const chatId = getChatId(current, currentChatUser);
    const msgs = getMessages(chatId);
    const container = document.getElementById('messages');
    container.innerHTML = '';
    msgs.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('message', msg.from === current ? 'sent' : 'received');
        if (msg.replyTo) {
            const replyMsg = msgs.find(m => m.id === msg.replyTo);
            if (replyMsg) {
                const replyDiv = document.createElement('div');
                replyDiv.classList.add('reply');
                replyDiv.textContent = replyMsg.text;
                div.appendChild(replyDiv);
            }
        }
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = msg.text;
        div.appendChild(bubble);
        const time = document.createElement('span');
        time.classList.add('timestamp');
        time.textContent = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        div.appendChild(time);
        const read = document.createElement('span');
        read.classList.add('read');
        read.textContent = '✓✓';
        div.appendChild(read);
        const replyBtn = document.createElement('button');
        replyBtn.textContent = 'Reply';
        replyBtn.onclick = () => startReply(msg.id, msg.text);
        div.appendChild(replyBtn);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => {
            deleteMessage(chatId, msg.id);
            loadMessages();
        };
        if (msg.from === current) div.appendChild(delBtn);
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

function startReply(id, text) {
    replyingTo = id;
    const preview = document.getElementById('reply-preview');
    preview.innerHTML = `Replying to: ${text.slice(0, 20)}${text.length > 20 ? '...' : ''} <button onclick="cancelReply()">x</button>`;
    preview.style.display = 'block';
}

function cancelReply() {
    replyingTo = null;
    const preview = document.getElementById('reply-preview');
    preview.style.display = 'none';
    preview.innerHTML = '';
}

function sendMessage() {
    const current = getCurrentUser();
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (text && currentChatUser) {
        const chatId = getChatId(current, currentChatUser);
        const message = {
            from: current,
            to: currentChatUser,
            text,
            timestamp: Date.now(),
            read: true,
            replyTo: replyingTo
        };
        addMessage(chatId, message);
        input.value = '';
        cancelReply();
        loadMessages();
        // Send via mock ws to simulate response
        ws.send(JSON.stringify({text, replyTo: replyingTo}));
    }
}

function showTyping() {
    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.classList.add('typing');
    typing.textContent = `${currentChatUser} is typing...`;
    document.getElementById('messages').appendChild(typing);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

function handleWsMessage(e) {
    const data = JSON.parse(e.data);
    if (data.typing) {
        showTyping();
    } else if (data.message) {
        const chatId = getChatId(getCurrentUser(), currentChatUser);
        addMessage(chatId, data.message);
        loadMessages();
        hideTyping();
    }
}