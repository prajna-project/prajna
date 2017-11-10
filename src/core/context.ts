const delegate = require('delegates');
const only = require('only');

const context: any = {
    inspect(): void {
        if (this === context) { return this; }
        return this.toJSON();
    },

    toJSON(): any {
        let ignores: string[] = ['inspect', 'toJSON', 'throw', 'onerror'];
        let runtimes: string[] = [];
        for (var prop in this) {
            if (!this.hasOwnProperty(prop) && ignores.indexOf(prop) === -1) {
                runtimes.push(prop);
            }
        }

        return only(this, runtimes);
    },

    throw(...args: any[]) {
        throw new Error(...args);
    },

    onerror(err: any): void {
        if (null == err) return;
        if (!(err instanceof Error)) err = new Error(`non-error thrown: ${err}`);
        return;
    },

    setKey(key: string, value: any) {
        Object.defineProperty(this.runtime, key, {
            get: function () {
                return value;
            },
            enumerable: true,
            configurable: true
        });
        delegate(context, 'runtime').getter(key);
    }
};

delegate(context, 'runtime')
    .access('env')
    .access('project')
    .access('thirdparty')
    .access('network')
    .access('version')
    .access('auto')
    .access('channel')
    .access('jsBridge')
    .access('ua')
    .access('region')
    .getter('region')
    .getter('screen')
    .getter('@timestamp');

export default context;
