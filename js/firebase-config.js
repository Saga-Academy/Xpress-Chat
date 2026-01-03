// firebase-config.js - Simplified for demo mode

// Demo mode - No actual Firebase configuration needed
const firebaseConfig = {
    // Empty config for demo mode
    apiKey: "demo-mode",
    authDomain: "demo-mode",
    projectId: "demo-mode",
    storageBucket: "demo-mode",
    messagingSenderId: "demo-mode",
    appId: "demo-mode"
};

// Mock Firebase services for compatibility
const auth = {
    currentUser: null,
    signOut: async () => {
        console.log('Mock: User signed out');
        return Promise.resolve();
    },
    signInWithEmailAndPassword: async (email, password) => {
        console.log('Mock: Sign in attempt', email);
        return Promise.resolve({ user: { uid: `demo_${Date.now()}` } });
    },
    createUserWithEmailAndPassword: async (email, password) => {
        console.log('Mock: Create user attempt', email);
        return Promise.resolve({ user: { uid: `demo_${Date.now()}` } });
    },
    signInAnonymously: async () => {
        console.log('Mock: Anonymous sign in');
        return Promise.resolve({ user: { uid: `anon_${Date.now()}` } });
    },
    onAuthStateChanged: (callback) => {
        // Simulate auth state
        setTimeout(() => {
            callback({ uid: localStorage.getItem('uid') || 'demo_user' });
        }, 100);
        return () => {}; // Unsubscribe function
    }
};

const db = {
    collection: (name) => ({
        doc: (id) => ({
            get: async () => ({
                exists: false,
                data: () => null
            }),
            set: async (data) => {
                console.log('Mock: Set document', name, id, data);
                return Promise.resolve();
            },
            update: async (data) => {
                console.log('Mock: Update document', name, id, data);
                return Promise.resolve();
            }
        }),
        add: async (data) => {
            console.log('Mock: Add document', name, data);
            return Promise.resolve({ id: `doc_${Date.now()}` });
        },
        where: () => ({
            orderBy: () => ({
                onSnapshot: (callback, errorCallback) => {
                    console.log('Mock: Setting up snapshot listener');
                    // Return unsubscribe function
                    return () => {};
                }
            })
        })
    })
};

// Export mock services
export { auth, db };
