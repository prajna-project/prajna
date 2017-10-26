import Performance from './performance.type';
export interface Padding {		// 附加信息是任意 json 结构的数据
    [key: string]: any
}

export default interface PV {
    name: string,						// 页面名称
    auto: boolean,						// 是否是自动pv
    referUrl: string,					// referer url
    unix: number,						// unix 时间戳
    url: string,						// 页面 url
    performanceNavigation?: Performance	// 页面性能
    padding?: Padding					// 附加信息
}
