const delegate = require('delegates');

const context: any = {
    inspect(): void {
        if (this === context) { return this; }
        return this.toJSON();
    },

    toJSON(): any {
        return {
            'testing...': true,
            'core': this.core.toJSON()
        };
    },

    throw(...args: any[]) {
        throw new Error(...args);
    },

    onerror(err: any): void {
        if (null == err) return;
        if (!(err instanceof Error)) err = new Error(`non-error thrown: ${err}`);
        return;
    }
};

delegate(context, 'runtime')
    .getter('env')
    .getter('project')
    .getter('thirdparty')
    .getter('version')
    .getter('auto')
    .getter('channel')
    .getter('network')
    .getter('jsBridge')
    .getter('ua')
    .getter('region')
    .access('timestamp');

export default context;
