
export class EventHandler {
    subscriptions: Record<string, ((payload: any) => void)[]>;

    constructor (eventNames: string[]) {
        this.subscriptions = eventNames.reduce((acc, cur) => {
            acc[cur] = [];
            return acc;
        }, {} as Record<string, (() => void)[]>);
    }

    subscribe (eventName: string, callback: () => void) {
        if (this.subscriptions[eventName] === undefined) throw new Error(`Event "${eventName}" is not registered. Available events: ${Object.keys(this.subscriptions).join(", ")}.`);

        this.subscriptions[eventName].push(callback);
    }

    emit (eventName: string, payload?: any) {
        if (this.subscriptions[eventName] === undefined) throw new Error(`Event "${eventName}" is not registered. Available events: ${Object.keys(this.subscriptions).join(", ")}.`);

        const callbacksToEmit = this.subscriptions[eventName];
        callbacksToEmit.forEach(callback => callback(payload));
    }
}
