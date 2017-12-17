export interface Padding {      // 附加信息是任意 json 结构的数据
    [key: string]: any;
}

export default interface PD {
    pageId: string;                     // 页面名称
    unix: number;                      // unix 时间戳
    url: string;                        // 页面 url
    duration: number;                   // 页面停留时间
    padding?: Padding;                  // 附加信息
}
