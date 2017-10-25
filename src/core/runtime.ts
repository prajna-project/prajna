import { Timing } from './types/performace.type';
import { ThirdParty, ThirdPartyType, Network, Bridge, BridgeType, Region, UserAgent, UA } from './types/message.type';
import getCurrentPosition from '../util/geolocation';

const only = require('only');
const version = require('../../package.json').version;
const UAParser = require('user-agent-parser');
const userAgent = require('useragent.js');

const GLOBAL: any = window;
const NAV: any = GLOBAL.navigator;

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

    set env(val: string) {
        GLOBAL.__prajnaEnv__ = val;
    },

    get project(): string {
        return GLOBAL.__appName__;
    },

    set project(val) {
        GLOBAL.__appName__ = val;
    },

    get thirdparty(): ThirdParty {
        let tp = {
            "type": ThirdPartyType.NONE // Not a message from thirdparty sdk
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
        return this.core.channel; // BUG: 在内部 runtime 里拿不到 channel
    },

    get netowrk(): Network {
        console.log('ere');
        `get network status`
        let connection: string;
        let network: Network = {
            online: NAV.onLine,
        };
        // if jsbridge exists, please write middleware to set accurate values
        let conn: any = NAV.connection || NAV.mozConnection || NAV.webkitConnection;
        let type: string = conn.type;
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
            type: BridgeType.OTHER
        };
    },

    get ua(): UA {
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
        let region: Region = runtime.getRegion();
        return region;
    },

    get timestamp(): string {
        let time = new Date();
        return time.toTimeString();
    },

    // set timestamp(timeString: string) {
    //     let time = new Date();
    //     this.timestamp = timeString || time.toTimeString();
    // },

    async getRegion(): Promise<Region> {
        let region = await getCurrentPosition();
        return region;
    }
};

export default runtime;
