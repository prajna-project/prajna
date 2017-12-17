import GLOBAL from '../util/global';
import {
    Bridge,
    BridgeType,
    Network,
    Region,
    UA,
} from './types/message.type';

const only = require('only');
const version = require('../../package.json').version;
const userAgent = require('useragent.js');

const NAV: any = GLOBAL.navigator;
const startTime = +new Date();

const runtime: any = {
    inspect(): any {
        if (!this.env) {
            return;
        }
        return this.toJSON();
    },

    toJSON(): any {
        return only(this, [
            'project',
            'env',
        ]);
    },

    get env(): string {
        return GLOBAL.__prajnaEnv__;
    },

    get project(): string {
        return GLOBAL.__appName__;
    },

    get version(): string {
        return version;
    },

    get auto(): boolean {
        return false;			// false by default
    },

    get channel(): string {
        return this.core.channel;
    },

    get network(): any {
        // get network status
        let connection: string;
        const network: Network = {
            online: NAV.onLine,
        };
        // if jsbridge exists, please write middleware to set accurate values
        const conn: any = NAV.connection || NAV.mozConnection || NAV.webkitConnection;
        const type: string = conn && conn.type;
        if (conn) {
            if (type) {
                connection = type;
            }
            if (conn.effectiveType) {
                connection = conn.effectiveType; // high version of Chrome
            }
        }
        if (connection) {
            network.connection = connection;
        }
        return network;
    },
    get jsBridge(): Bridge {
        // if jsbridge exists, please write middleware to set accurate values
        return {
            type : BridgeType.NONE,
        };
    },

    get userAgent(): UA {
        const ua = GLOBAL.navigator.userAgent;
        return {
            ua,
            browser: userAgent.analyze(ua).browser.full || '',
            os: userAgent.analyze(ua).os.full || '',
            device: userAgent.analyze(ua).device.full || '',
            platform: userAgent.analyze(ua).platform.full || '',
        };
    },

    get region(): Region {
        return { lng: '', lat: '' };
    },

    get screen(): string {
        const height = GLOBAL.screen.height;
        const width = GLOBAL.screen.width;
        return width + "*" + height;
    },

    get ['@timestamp'](): string {
        return Date.now().toString();
    },

    get duration(): number {
        const now = +new Date();
        const duration = window.performance ? Math.floor(window.performance.now()) : Math.floor(now - startTime);
        return duration;
    },
};

export default runtime;
