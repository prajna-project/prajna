import Performance, { Memory } from './performance.type';
import Log from './log.type';
import Resource from './resource.type';
import Event from './event.type';
import PV from './pv.type';
import PD from './pd.type';

export interface Region {
    lng: string,				// longitude
    lat: string					// latitude
}

export enum BridgeType {
    NONE = 'NONE',
    OTHER = 'OTHER'
}

export interface Bridge {
    type: BridgeType
    // ....
}

export interface UA {
    ua: string,					// us string
    browser: string,			// 浏览器信息
    os: string,					// 操作系统
    device?: string,			// 设备信息
    platform?: string
}

export enum ThirdPartyType {
    NONE,						// TODO: to string
    // NONE = "NONE",
}

export interface ThirdParty {
    type: ThirdPartyType		// 第三方 sdk 类型
    version?: string			// 第三方 sdk 版本
    apiVersion?: string,		// [OPTIONAL] cat 接口版本号
}

export interface Network {
    online?: boolean,			// [OPTIONAL] 是否在线
    isp?: string,				// [OPTIONAL] 网络供应商信息
    connection?: string			// [OPTIONAL] 网络类型
}

export default interface Message {
    // runtime
    "@timestamp": string,		// ES 所需要的 UTC timestamp
    env: string,				// 开发环境信息
    project: string,			// 项目名称
    thirdparty: ThirdParty,		// 第三方 sdk
    auto: boolean,				// 是否是自动打点(默认false，true给无埋点用)
    userAgent: UA,						// ua 信息
    os?: string,				// [废弃] 操作系统信息
    device?: string,			// [废弃] 设备信息
    channel?: string,			// [OPTIONAL] 渠道
    version?: string,			// [OPTIONAL] SDK url (前端不使用 whatever4 则没有)
    unionId?: string,			// [OPTIONAL] 用户ID，用户的唯一id
    network?: Network,			// [OPTIONAL] 网络情况
    region?: Region,			// [OPTIONAL] 用户地理信息
    jsBridge?: Bridge,			// [OPTIONAL] JS bridge 信息(Hybrid 应用)
    // middleware
    pv?: PV,					// [OPTIONAL] PV 信息
    pd?: PD,                    // [OPTIONAL] PD 信息
    performance?: Performance,	// [OPTIONAL] 页面性能数据信息
    xhr?: Resource,				// [OPTIONAL] 网络 ajax 请求信息
    resource?: Resource,			// [OPTIONAL] 网络资源请求信息
    event?: Event,				// [OPTIONAL] 页面事件信息
    log?: Log,					// [OPTIONAL] 主动上报日志信息
}
