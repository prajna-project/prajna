export default interface Ajax {
    resourceUrl: string;    // 资源地址
    pageId: string;         // 页面名称
    pageUrl: string;        // page url
    unix: number;           // 时间戳
    status: number;         // 状态码
    responsetime: number;   // 响应时间
    body?: any;             // 发送数据
    responsedata?: any;     // 服务器返回
}