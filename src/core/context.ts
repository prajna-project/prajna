const delegate = require('delegates');

const proto: any = {
    inspect(): void {
        if (this === proto) { return this; }
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

delegate(proto, 'runtime')
    .getter('ua');

export default proto;
