import Performance from './performance.type';
import Log from './log.type';
import Resource from './resource.type';
import Event from './event.type';
import PV from './pv.type';
import PD from './pd.type';
export interface Region {
    lng: string;
    lat: string;
}
export declare enum BridgeType {
    NONE = "NONE",
}
export interface Bridge {
    type: BridgeType;
}
export interface UA {
    ua: string;
    browser: string;
    os: string;
    device?: string;
    platform?: string;
}
export declare enum ThirdPartyType {
    NONE = 0,
}
export interface ThirdParty {
    type: ThirdPartyType;
    version?: string;
    apiVersion?: string;
}
export interface Network {
    online?: boolean;
    isp?: string;
    connection?: string;
}
export default interface Message {
    timestamp: string;
    env: string;
    project: string;
    thirdparty: ThirdParty;
    auto: boolean;
    userAgent: UA;
    os?: string;
    device?: string;
    channel?: string;
    version?: string;
    unionId?: string;
    network?: Network;
    region?: Region;
    jsBridge?: Bridge;
    pv?: PV;
    pd?: PD;
    performance?: Performance;
    xhr?: Resource;
    resource?: Resource;
    event?: Event;
    log?: Log;
}
