import Delegator from './delegates';
const only = require('only');

const context: any = {
    inspect(): void {
        if (this === context) { return this; }
        return this.toJSON();
    },

    toJSON(): any {
        const ignores: string[] = ['inspect', 'toJSON', 'throw', 'onerror', 'defineGetter'];
        const runtimes: string[] = [];
        for (const prop in this) {
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
        if (null == err) {
            return;
        }
        if (!(err instanceof Error)) {
            err = new Error(`non-error thrown: ${err}`);
        }
        return;
    },

    defineGetter(key: string, value: any) {
        Object.defineProperty(this.runtime, key, {
            get: () => {
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        new Delegator(context, 'runtime').getter(key);
    },
};

new Delegator(context, 'runtime')
    .access('env')
    .access('project')
    // .access('thirdparty')
    .access('network')
    .access('version')
    .access('auto')
    // .access('channel')
    .access('jsBridge')
    .access('userAgent')
    .access('region')
    .getter('region')
    .getter('screen')
    .getter('@timestamp')
    .getter('duration');

export default context;
