const delegate = require('delegates');
const only = require('only');

const context: any = {
    inspect(): void {
        if (this === context) { return this; }
        return this.toJSON();
    },

    toJSON(): any {
        return only(this, [
            'env',
            'project',
            'thirdparty',
            'network',
            'version',
            'auto',
            'channel',
            'jsBridge',
            'ua',
            '@timestamp',
            'region',
        ]);
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
    .getter('@timestamp');

export default context;
