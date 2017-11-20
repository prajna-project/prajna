const delegate = require('delegates');
const only = require('only');

const context: any = {
    inspect(): void {
        if (this === context) { return this; }
        return this.toJSON();
    },

    toJSON(): any {
        let ignores: string[] = ['inspect', 'toJSON', 'throw', 'onerror', 'defineGetter'];
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

    defineGetter(key: string, value: any) {
        if (!Object.defineProperty ||
            !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } }())) {
            let orig = Object.defineProperty;
            Object.defineProperty = function (o: any, prop: string, desc: any) {
                let _Object: any = Object;
                // In IE8 try built-in implementation for defining properties on DOM prototypes.
                if (orig) { try { return orig(o, prop, desc); } catch (e) { } }
                if (o !== Object(o)) { throw TypeError("Object.defineProperty called on non-object"); }
                if (_Object.prototype.__defineGetter__ && ('get' in desc)) {
                    _Object.prototype.__defineGetter__.call(o, prop, desc.get);
                }
                if (_Object.prototype.__defineSetter__ && ('set' in desc)) {
                    _Object.prototype.__defineSetter__.call(o, prop, desc.set);
                }
                if ('value' in desc) {
                    o[prop] = desc.value;
                }
                return o;
            };
        }
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
    .access('userAgent')
    .access('region')
    .getter('region')
    .getter('screen')
    .getter('@timestamp')
    .getter('duration');

export default context;
