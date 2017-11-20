export enum EventType {
    MODULE_CLICK,
    MODULE_VIEW,
    MODULE_EDIT,
    PAGE_DISAPPEAR,
    MGE
}

export interface Padding {		// 附加信息是任意 json 结构的数据
    [key: string]: any,
}

export default interface Event {
    type: EventType,			// 事件类型
    analyticsId: string,		// 埋点信息，对应灵犀的 valBid
    padding?: Padding,			// 附加信息
    unix: number,				// unix 时间戳
    orderid?: string,			// 订单id(给 C 端支付用)
    duration?: number			// 停留时常(给page disappaer用)
}
