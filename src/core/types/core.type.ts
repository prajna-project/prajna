import Core from '../core';

export interface InitOption {
    pageId: string,				// 当前页面 ID
    pageUrl: string,			// 当前页面的 URL
    channel: string,			// 当前页面进入的渠道
    // ...
}

export interface Prajna {
    init: (opt: InitOption) => Core
}
