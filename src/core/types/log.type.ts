// 基础的主动上报信息
export enum LogLevel {
    ERROR,
    WARNING,
    info,
    DEBUG
}

export interface Padding {		// 附加信息是任意 json 结构的数据
    [key: string]: any
}

export default interface Log {
    unix: number,				// unix 时间戳
    content: string,			// 日志内容
    level: LogLevel,			// 日志级别
    padding?: Padding			// 附加信息
}
