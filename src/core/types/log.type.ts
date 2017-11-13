// 基础的主动上报信息
export enum LogLevel {
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
}

export interface Padding {		// 附加信息是任意 json 结构的数据
    [key: string]: any
}

export enum Category {
    SCRIPT = 'jsError',
    AJAX = 'ajaxError',
    RESOURCE = 'resourceError',

    REPORT = 'jsReport',
    MODULE_CLICK = 'moduleClick',
    MODULE_VIEW = 'moduleView',
    MODULE_EDIT = 'moduleEdit',
    PAGE_DISAPPEAR = 'pageDisappear'
}

export default interface Log {
    unix: number,				// unix 时间戳
    category: Category,			// 类别
    name: string,				// 错误名
    content: string,			// 日志内容
    level: LogLevel,			// 日志级别
    pageUrl: string,			// page url
    pageId?: string,			// page id
    padding?: Padding,			// 附加信息
    resourceUrl?: string		// 资源 url
}
