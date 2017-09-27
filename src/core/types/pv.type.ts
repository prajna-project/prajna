export interface Padding {		// 附加信息是任意 json 结构的数据
    [key: string]: any
}

export default interface PV {
    referUrl: string,			// referer url
    unix: number,				// unix 时间戳
    url: string,				// 页面 url
    padding?: Padding			// 附加信息
}
