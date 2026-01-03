// ChatApp - Main JavaScript File with Authentication
// WeChat Clone Implementation

class ChatApp {
    constructor() {
        this.currentChat = null;
        this.chats = [];
        this.contacts = [];
        this.messages = {};
        this.user = null; // Will be set after authentication check
        this.currentUser = null;
        
        this.init();
    }

    init() {
        // Check authentication first
        if (!this.checkAuthentication()) {
            return;
        }
        
        this.loadData();
        this.setupEventListeners();
        this.renderChatList();
        this.startMessageSimulation();
        this.initAnimations();
    }

    checkAuthentication() {
        const currentUser = localStorage.getItem('chatapp_current_user');
        if (!currentUser) {
            // Redirect to login if not authenticated
            if (window.location.pathname !== '/login.html' && !window.location.href.includes('login.html')) {
                window.location.href = 'login.html';
            }
            return false;
        }
        
        // Set current user
        this.currentUser = JSON.parse(currentUser);
        this.user = {
            id: this.currentUser.id,
            name: this.currentUser.name,
            avatar: this.currentUser.avatar
        };
        
        return true;
    }

    loadData() {
        // Load from localStorage or initialize with mock data
        const savedChats = localStorage.getItem('chatapp_chats');
        const savedMessages = localStorage.getItem('chatapp_messages');
        const savedContacts = localStorage.getItem('chatapp_contacts');

        if (savedChats) {
            this.chats = JSON.parse(savedChats);
        } else {
            this.chats = this.getMockChats();
        }

        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        } else {
            this.messages = this.getMockMessages();
        }

        if (savedContacts) {
            this.contacts = JSON.parse(savedContacts);
        } else {
            this.contacts = this.getMockContacts();
        }
    }

    saveData() {
        localStorage.setItem('chatapp_chats', JSON.stringify(this.chats));
        localStorage.setItem('chatapp_messages', JSON.stringify(this.messages));
        localStorage.setItem('chatapp_contacts', JSON.stringify(this.contacts));
    }

    getMockChats() {
        return [
            {
                id: 'chat1',
                contactId: 'contact1',
                lastMessage: 'Hey! How are you doing?',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                unread: 2,
                isOnline: true
            },
            {
                id: 'chat2',
                contactId: 'contact2',
                lastMessage: 'The meeting is at 3 PM tomorrow',
                timestamp: new Date(Date.now() - 900000).toISOString(),
                unread: 0,
                isOnline: false
            },
            {
                id: 'chat3',
                contactId: 'contact3',
                lastMessage: 'Did you see the latest update?',
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                unread: 1,
                isOnline: true
            },
            {
                id: 'chat4',
                contactId: 'contact4',
                lastMessage: 'Thanks for your help! 😊',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                unread: 0,
                isOnline: false
            },
            {
                id: 'chat5',
                contactId: 'contact5',
                lastMessage: 'Let me check and get back to you',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                unread: 0,
                isOnline: true
            }
        ];
    }

    getMockMessages() {
        const now = new Date();
        return {
            'chat1': [
                {
                    id: 'msg1',
                    text: 'Hi there! 👋',
                    sender: 'contact1',
                    timestamp: new Date(now - 600000).toISOString(),
                    status: 'read'
                },
                {
                    id: 'msg2',
                    text: 'Hey! How are you doing?',
                    sender: this.user.id,
                    timestamp: new Date(now - 300000).toISOString(),
                    status: 'delivered'
                },
                {
                    id: 'msg3',
                    text: 'I\'m doing great! Just working on some new features.',
                    sender: 'contact1',
                    timestamp: new Date(now - 240000).toISOString(),
                    status: 'read'
                },
                {
                    id: 'msg4',
                    text: 'That sounds exciting! What kind of features?',
                    sender: this.user.id,
                    timestamp: new Date(now - 180000).toISOString(),
                    status: 'sent'
                }
            ],
            'chat2': [
                {
                    id: 'msg5',
                    text: 'Don\'t forget about our meeting tomorrow',
                    sender: 'contact2',
                    timestamp: new Date(now - 1200000).toISOString(),
                    status: 'read'
                },
                {
                    id: 'msg6',
                    text: 'The meeting is at 3 PM tomorrow',
                    sender: this.user.id,
                    timestamp: new Date(now - 900000).toISOString(),
                    status: 'delivered'
                }
            ],
            'chat3': [
                {
                    id: 'msg7',
                    text: 'Did you see the latest update?',
                    sender: 'contact3',
                    timestamp: new Date(now - 1800000).toISOString(),
                    status: 'read'
                }
            ],
            'chat4': [
                {
                    id: 'msg8',
                    text: 'Thanks for your help! 😊',
                    sender: 'contact4',
                    timestamp: new Date(now - 3600000).toISOString(),
                    status: 'read'
                }
            ],
            'chat5': [
                {
                    id: 'msg9',
                    text: 'Let me check and get back to you',
                    sender: 'contact5',
                    timestamp: new Date(now - 7200000).toISOString(),
                    status: 'read'
                }
            ]
        };
    }

    getMockContacts() {
        return [
            {
                id: 'contact1',
                name: 'Sarah Johnson',
                avatar: 'https://kimi-web-img.moonshot.cn/img/tracywrightcorvo.com/45f4a24e606db8c6fc6cb141ab47d93fc9e286a4.jpg',
                status: 'Software Developer',
                isOnline: true,
                lastSeen: new Date().toISOString()
            },
            {
                id: 'contact2',
                name: 'Mike Chen',
                avatar: 'https://kimi-web-img.moonshot.cn/img/img.freepik.com/33796f1de011459bb90b9e8caae24265fb5e00a4.jpg',
                status: 'Product Manager',
                isOnline: false,
                lastSeen: new Date(Date.now() - 1800000).toISOString()
            },
            {
                id: 'contact3',
                name: 'Emily Davis',
                avatar: 'https://kimi-web-img.moonshot.cn/img/images.rawpixel.com/068f7bd92911b9f69d6e398f9bbfd11985239fbc.jpg',
                status: 'UX Designer',
                isOnline: true,
                lastSeen: new Date().toISOString()
            },
            {
                id: 'contact4',
                name: 'Alex Rodriguez',
                avatar: 'https://kimi-web-img.moonshot.cn/img/headshots-inc.com/8449031380f3d0f96f847f9d90dc2f301a15e9ad.jpg',
                status: 'Marketing Specialist',
                isOnline: false,
                lastSeen: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 'contact5',
                name: 'Lisa Wang',
                avatar: 'https://kimi-web-img.moonshot.cn/img/www.profilebakery.com/d1b551532dafe7d6076ca545a500f7eafc3a9774.jpg',
                status: 'Data Analyst',
                isOnline: true,
                lastSeen: new Date().toISOString()
            },
            {
                id: 'contact6',
                name: 'David Kim',
                avatar: 'https://kimi-web-img.moonshot.cn/img/media.istockphoto.com/931fe7fe4c12d16b6eff1d46fb35eab953769494.jpg',
                status: 'DevOps Engineer',
                isOnline: false,
                lastSeen: new Date(Date.now() - 7200000).toISOString()
            },
            {
                id: 'contact7',
                name: 'Rachel Green',
                avatar: 'https://kimi-web-img.moonshot.cn/img/t3.ftcdn.net/0ce9154ac87c256b665af2d220a3a754cb1c95a8.jpg',
                status: 'Graphic Designer',
                isOnline: true,
                lastSeen: new Date().toISOString()
            },
            {
                id: 'contact8',
                name: 'Tom Wilson',
                avatar: 'https://kimi-web-img.moonshot.cn/img/t3.ftcdn.net/2bfd6d9887af2a88e5f2fbcabc0d15238da2f340.jpg',
                status: 'Sales Manager',
                isOnline: false,
                lastSeen: new Date(Date.now() - 5400000).toISOString()
            }
        ];
    }

    setupEventListeners() {
        // Add logout functionality
        this.addLogoutListener();

        // Chat search
        document.getElementById('chatSearch').addEventListener('input', (e) => {
            this.filterChats(e.target.value);
        });

        // Message input
        const messageInput = document.getElementById('messageInput');
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        messageInput.addEventListener('input', (e) => {
            this.autoResizeTextarea(e.target);
        });

        // Send button
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Emoji button
        document.getElementById('emojiBtn').addEventListener('click', () => {
            this.toggleEmojiPicker();
        });

        // Voice button
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.showVoiceModal();
        });

        // Voice modal
        document.getElementById('cancelVoice').addEventListener('click', () => {
            this.hideVoiceModal();
        });

        document.getElementById('sendVoice').addEventListener('click', () => {
            this.sendVoiceMessage();
        });

        // Emoji picker
        document.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.insertEmoji(e.target.dataset.emoji);
            });
        });

        // Search and more buttons
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.showSearch();
        });

        document.getElementById('moreBtn').addEventListener('click', () => {
            this.showMoreOptions();
        });
    }

    addLogoutListener() {
        // Add logout functionality to profile page or create a logout button
        // This is a placeholder - you can add a logout button in the header or profile page
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    logout() {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('chatapp_current_user');
            localStorage.removeItem('chatapp_remember_me');
            window.location.href = 'login.html';
        }
    }

    renderChatList() {
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';

        this.chats.forEach(chat => {
            const contact = this.contacts.find(c => c.id === chat.contactId);
            if (!contact) return;

            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors';
            chatItem.dataset.chatId = chat.id;

            const time = new Date(chat.timestamp);
            const timeStr = this.formatTime(time);

            chatItem.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="relative">
                        <img src="${contact.avatar}" alt="${contact.name}" class="w-12 h-12 rounded-full object-cover">
                        ${contact.isOnline ? '<div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full online-indicator"></div>' : ''}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-gray-900 truncate">${contact.name}</h3>
                            <span class="text-xs text-gray-500">${timeStr}</span>
                        </div>
                        <div class="flex items-center justify-between mt-1">
                            <p class="text-sm text-gray-600 truncate">${chat.lastMessage}</p>
                            ${chat.unread > 0 ? `<span class="bg-emerald-500 text-white text-xs rounded-full px-2 py-1">${chat.unread}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;

            chatItem.addEventListener('click', () => {
                this.selectChat(chat.id);
            });

            chatList.appendChild(chatItem);
        });
    }

    selectChat(chatId) {
        this.currentChat = chatId;
        
        // Update active chat styling
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('bg-emerald-50', 'border-l-4', 'border-emerald-500');
        });
        
        const selectedChat = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (selectedChat) {
            selectedChat.classList.add('bg-emerald-50', 'border-l-4', 'border-emerald-500');
        }

        // Clear unread count
        const chat = this.chats.find(c => c.id === chatId);
        if (chat && chat.unread > 0) {
            chat.unread = 0;
            this.saveData();
            this.renderChatList();
        }

        // Update chat header
        this.updateChatHeader(chatId);
        
        // Render messages
        this.renderMessages(chatId);
    }

    updateChatHeader(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        const contact = this.contacts.find(c => c.id === chat.contactId);
        
        if (contact) {
            document.getElementById('currentChatName').textContent = contact.name;
            document.getElementById('currentChatAvatar').src = contact.avatar;
            document.getElementById('currentChatStatus').textContent = contact.isOnline ? 'Online' : `Last seen ${this.formatLastSeen(contact.lastSeen)}`;
            
            const onlineStatus = document.getElementById('onlineStatus');
            if (contact.isOnline) {
                onlineStatus.classList.remove('hidden');
            } else {
                onlineStatus.classList.add('hidden');
            }
        }
    }

    renderMessages(chatId) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messages = this.messages[chatId] || [];
        
        messagesContainer.innerHTML = '';

        messages.forEach((message, index) => {
            const messageDiv = document.createElement('div');
            const isUser = message.sender === this.user.id;
            
            messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`;
            
            const messageTime = new Date(message.timestamp);
            const timeStr = this.formatTime(messageTime);
            
            messageDiv.innerHTML = `
                <div class="message-bubble max-w-xs ${isUser ? 'bg-emerald-500 text-white' : 'bg-white text-gray-900'} rounded-lg px-4 py-2 shadow-sm">
                    <p class="text-sm">${this.escapeHtml(message.text)}</p>
                    <div class="flex items-center justify-end mt-1 space-x-1">
                        <span class="text-xs ${isUser ? 'text-emerald-100' : 'text-gray-500'}">${timeStr}</span>
                        ${isUser ? this.getStatusIcon(message.status) : ''}
                    </div>
                </div>
            `;

            messagesContainer.appendChild(messageDiv);
        });

        // Scroll to bottom
        this.scrollToBottom();
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();
        
        if (!text || !this.currentChat) return;

        const message = {
            id: 'msg_' + Date.now(),
            text: text,
            sender: this.user.id,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        // Add message to current chat
        if (!this.messages[this.currentChat]) {
            this.messages[this.currentChat] = [];
        }
        this.messages[this.currentChat].push(message);

        // Update last message in chat list
        const chat = this.chats.find(c => c.id === this.currentChat);
        if (chat) {
            chat.lastMessage = text;
            chat.timestamp = message.timestamp;
        }

        // Clear input
        messageInput.value = '';
        this.autoResizeTextarea(messageInput);

        // Hide emoji picker if open
        document.getElementById('emojiPicker').classList.add('hidden');

        // Re-render messages and chat list
        this.renderMessages(this.currentChat);
        this.renderChatList();
        this.saveData();

        // Animate message send
        this.animateMessageSend();

        // Simulate message delivery and read status
        setTimeout(() => {
            message.status = 'delivered';
            this.renderMessages(this.currentChat);
            this.saveData();
        }, 1000);

        // Simulate typing indicator and response
        this.simulateTyping();
    }

    simulateTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.classList.remove('hidden');
        
        setTimeout(() => {
            typingIndicator.classList.add('hidden');
            this.sendAutoReply();
        }, 2000 + Math.random() * 2000);
    }

    sendAutoReply() {
        const replies = [
            'That\'s interesting! Tell me more.',
            'I see what you mean.',
            'Thanks for sharing that!',
            'Got it! 👍',
            'Sounds good to me!',
            'I\'ll look into that.',
            'Great idea!',
            'Let me think about it.',
            'I agree with you.',
            'That makes sense!'
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const message = {
            id: 'msg_' + Date.now(),
            text: randomReply,
            sender: this.contacts.find(c => c.id === this.chats.find(ch => ch.id === this.currentChat).contactId).id,
            timestamp: new Date().toISOString(),
            status: 'read'
        };

        if (!this.messages[this.currentChat]) {
            this.messages[this.currentChat] = [];
        }
        this.messages[this.currentChat].push(message);

        // Update last message
        const chat = this.chats.find(c => c.id === this.currentChat);
        if (chat) {
            chat.lastMessage = randomReply;
            chat.timestamp = message.timestamp;
        }

        this.renderMessages(this.currentChat);
        this.renderChatList();
        this.saveData();
        this.animateMessageReceive();
    }

    toggleEmojiPicker() {
        const emojiPicker = document.getElementById('emojiPicker');
        emojiPicker.classList.toggle('hidden');
        
        if (!emojiPicker.classList.contains('hidden')) {
            anime({
                targets: emojiPicker,
                opacity: [0, 1],
                translateY: [-10, 0],
                duration: 200,
                easing: 'easeOutQuad'
            });
        }
    }

    insertEmoji(emoji) {
        const messageInput = document.getElementById('messageInput');
        messageInput.value += emoji;
        messageInput.focus();
        this.toggleEmojiPicker();
    }

    showVoiceModal() {
        document.getElementById('voiceModal').classList.remove('hidden');
        anime({
            targets: '#voiceModal .bg-white',
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutBack'
        });
    }

    hideVoiceModal() {
        anime({
            targets: '#voiceModal .bg-white',
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuad',
            complete: () => {
                document.getElementById('voiceModal').classList.add('hidden');
            }
        });
    }

    sendVoiceMessage() {
        const message = {
            id: 'msg_' + Date.now(),
            text: '🎤 Voice message (30s)',
            sender: this.user.id,
            timestamp: new Date().toISOString(),
            status: 'sent',
            type: 'voice'
        };

        if (!this.messages[this.currentChat]) {
            this.messages[this.currentChat] = [];
        }
        this.messages[this.currentChat].push(message);

        const chat = this.chats.find(c => c.id === this.currentChat);
        if (chat) {
            chat.lastMessage = '🎤 Voice message';
            chat.timestamp = message.timestamp;
        }

        this.renderMessages(this.currentChat);
        this.renderChatList();
        this.saveData();
        this.hideVoiceModal();
        this.animateMessageSend();
    }

    filterChats(query) {
        const chatItems = document.querySelectorAll('.chat-item');
        const lowerQuery = query.toLowerCase();

        chatItems.forEach(item => {
            const chatId = item.dataset.chatId;
            const chat = this.chats.find(c => c.id === chatId);
            const contact = this.contacts.find(c => c.id === chat.contactId);
            
            if (contact.name.toLowerCase().includes(lowerQuery) || 
                chat.lastMessage.toLowerCase().includes(lowerQuery)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        const messagesArea = document.getElementById('messagesArea');
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString();
    }

    formatLastSeen(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }

    getStatusIcon(status) {
        switch (status) {
            case 'sent':
                return '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            case 'delivered':
                return '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            case 'read':
                return '<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            default:
                return '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    animateMessageSend() {
        const lastMessage = document.querySelector('#messagesContainer .message-bubble:last-child');
        if (lastMessage) {
            anime({
                targets: lastMessage,
                scale: [0.8, 1],
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 300,
                easing: 'easeOutBack'
            });
        }
    }

    animateMessageReceive() {
        const lastMessage = document.querySelector('#messagesContainer .message-bubble:last-child');
        if (lastMessage) {
            anime({
                targets: lastMessage,
                scale: [0.8, 1],
                opacity: [0, 1],
                translateX: [-20, 0],
                duration: 400,
                easing: 'easeOutElastic(1, .8)'
            });
        }
    }

    initAnimations() {
        // Animate header on load
        anime({
            targets: 'header',
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuad'
        });

        // Animate chat list items
        anime({
            targets: '.chat-item',
            translateX: [-50, 0],
            opacity: [0, 1],
            duration: 400,
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
        });

        // Animate bottom navigation
        anime({
            targets: 'nav',
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 500,
            delay: 300,
            easing: 'easeOutQuad'
        });
    }

    startMessageSimulation() {
        // Simulate random messages every 30-60 seconds
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance
                const randomChat = this.chats[Math.floor(Math.random() * this.chats.length)];
                if (randomChat && randomChat !== this.currentChat) {
                    randomChat.unread++;
                    this.renderChatList();
                    this.saveData();
                }
            }
        }, 30000 + Math.random() * 30000);
    }

    showSearch() {
        document.getElementById('chatSearch').focus();
    }

    showMoreOptions() {
        alert('More options coming soon!');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize ChatApp if we're on the main pages (not login)
    if (window.location.pathname !== '/login.html' && !window.location.href.includes('login.html')) {
        window.chatApp = new ChatApp();
    }
});

// Add some global utility functions
window.showNotification = function(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });

    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
};