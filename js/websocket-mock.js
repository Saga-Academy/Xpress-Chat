// js/websocket-mock.js
class MockWebSocket {
    constructor(current, other) {
        this.current = current;
        this.other = other;
        this.onmessage = () => {};
    }

    send(dataStr) {
        // Simulate typing
        setTimeout(() => {
            this.onmessage({data: JSON.stringify({typing: true})});
        }, 500);

        // Simulate response
        setTimeout(() => {
            const response = {
                from: this.other,
                to: this.current,
                text: 'This is a simulated response!',
                timestamp: Date.now(),
                read: true,
                replyTo: null
            };
            this.onmessage({data: JSON.stringify({message: response})});
        }, 3000);
    }
}