import {
    ThirdParty,
    ThirdPartyType,
    Network,
    Bridge,
    BridgeType,
    Region,
    UA
} from './types/message.type';
import Performance, { Timing } from './types/performance.type';
import getCurrentPosition from '../util/geolocation';
import getEntries from '../util/getEntries';
import GLOBAL from '../util/global';

const only = require('only');
const version = require('../../build/version.json').version;
const userAgent = require('useragent.js');

const NAV: any = GLOBAL.navigator;
const isSupportGetEntry = GLOBAL.performance && GLOBAL.performance.getEntries !== void (0);
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
            'env'
        ]);
    },

    get env(): string {
        return GLOBAL.__prajnaEnv__;
    },

    get project(): string {
        return GLOBAL.__appName__;
    },

    get thirdparty(): ThirdParty {
        const tp: ThirdParty = {
            "type": ThirdPartyType.NONE
        }
        return tp;
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
        `get network status`
        let connection: string;
        let network: Network = {
            online: NAV.onLine,
        };
        // if jsbridge exists, please write middleware to set accurate values
        let conn: any = NAV.connection || NAV.mozConnection || NAV.webkitConnection;
        let type: string = conn && conn.type;
        if (conn) {
            if (type) {
                connection = type
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
        `if jsbridge exists, please write middleware to set accurate values`
        return {
            type: BridgeType.NONE
        }
    },

    get userAgent(): UA {
        let ua = GLOBAL.navigator.userAgent;
        return {
            ua: ua,
            browser: userAgent.analyze(ua).browser.full || '',
            os: userAgent.analyze(ua).os.full || '',
            device: userAgent.analyze(ua).device.full || '',
            platform: userAgent.analyze(ua).platform.full || ''
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
        let time = new Date();
        return time.toISOString();
    },

    get duration(): number {
        const now = +new Date();
        const duration = window.performance ? window.performance.now() : (now - startTime);
        return duration;
    }
};

export default runtime;
