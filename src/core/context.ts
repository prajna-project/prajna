const delegate = require('delegates');

// prototype
const context: any = {
    assert(): void { },
    throw(...args: any[]): void { },
    onerror(err: any): void { },
    inspect(): void {
        if (this === context) {
            return this;
        }
        return this.toJSON;
    },
    toJSON(): any {
        return this;
    }
};

delegate(context, 'action').getter('test');

delegate(context, 'directive').getter('test');

export { context };
