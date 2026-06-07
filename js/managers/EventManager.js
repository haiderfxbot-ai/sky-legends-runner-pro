class EventManager {
    constructor() {
        this.events = {};
        this.oneTimeEvents = {};
    }

    on(event, callback, context = null) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({ callback, context });
        return () => this.off(event, callback);
    }

    once(event, callback, context = null) {
        if (!this.oneTimeEvents[event]) {
            this.oneTimeEvents[event] = [];
        }
        this.oneTimeEvents[event].push({ callback, context });
    }

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(
                handler => handler.callback !== callback
            );
        }
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(handler => {
                handler.callback.apply(handler.context, args);
            });
        }

        if (this.oneTimeEvents[event]) {
            this.oneTimeEvents[event].forEach(handler => {
                handler.callback.apply(handler.context, args);
            });
            delete this.oneTimeEvents[event];
        }
    }

    removeAllListeners(event) {
        if (event) {
            delete this.events[event];
            delete this.oneTimeEvents[event];
        } else {
            this.events = {};
            this.oneTimeEvents = {};
        }
    }

    listenerCount(event) {
        const regular = this.events[event] ? this.events[event].length : 0;
        const oneTime = this.oneTimeEvents[event] ? this.oneTimeEvents[event].length : 0;
        return regular + oneTime;
    }
}

const eventManager = new EventManager();
