export default interface Resource {
    pageId: string;
    pageUrl: string;
    resourceUrl: string;		// 资源 url
    unix: number;				// unix 时间戳
    status: number;				// 拉取资源的 http 状态码
    requestbyte?: number;		// 发送字节数
    responsebyte?: number;		// 返回字节数
    responsetime?: number		// 返回时长(毫秒)
}
