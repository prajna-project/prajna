import Timing from './types/performace.type';
const only = require('only');

const GLOBAL: Window = window;
const NAV: Navigator = GLOBAL.navigator;

const runtime: any = {
    inspect(): any {
        if (!this.env) {
            return;
        }
        return this.toJSON();
    },

    toJSON(): any {
        return only(this, [
            'ua',
        ]);
    },

    get ua(): string {
        return NAV.userAgent;
    },

    get performance(): Performance {
        return GLOBAL.performance;
    }
};

export { runtime };
