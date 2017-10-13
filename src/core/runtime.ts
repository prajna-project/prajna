import { Timing } from './types/performace.type';
import { ThirdParty, ThirdPartyType, Network, Bridge, BridgeType, Region, UserAgent } from './types/message.type';
import getCurrentPosition from '../util/geolocation';

const only = require('only');
const version = require('../../package.json').version;
const UAParser = require('user-agent-parser');

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

    get project(): string {
        return GLOBAL.__appName__;;
    },

    get thirdParty(): ThirdParty {
        return {
            "type": ThirdPartyType.NONE // Not a message from thirdparty sdk
        };
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

    get ua(): UserAgent {
        let uap = new UAParser(GLOBAL.navigator.userAgent);
        return {
            device: uap.getDevice(),
            engine: uap.getEngine(),
            os: uap.getOS()
        };
    },

    get region(): Region {
        let region: Region = runtime.getRegion();
        return region;
    },

    set timestamp(isoString: string) {
        if (isoString) {
            this.msg['@timestamp'] = isoString
        } else {
            let now = new Date();
            this.msg['@timestamp'] = now.toISOString();
        }
    },

    async getRegion(): Promise<Region> {
        let region = await getCurrentPosition();
        return region;
    }
};

export default runtime;
