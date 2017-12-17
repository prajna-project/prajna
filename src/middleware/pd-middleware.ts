const ls = require('local-storage'); // tslint-disable-line

import GLOBAL from '../util/global';
import postXHR from '../util/xhr';

import Category, { CacheKey } from '../core/types/category.type';
import Message from '../core/types/message.type';
import PD from '../core/types/pd.type';

let PD_FLAG: boolean = true;

// 时间戳问题
function _sendPDData(ctx: any, padding?: any) {
    const mergedData: Message[] = [];
    const raw: Message =  ctx.inspect();

    const pd: PD = {
        pageId: ctx.core.pageId,   // 页面名称
        unix: +new Date(),		   // unix 时间戳
        url: GLOBAL.location.href, // 页面 url
        duration: ctx.duration,	   // 页面停留时间
        padding: padding || {},	   // 附加信息
    };

    raw.pd = pd;
    raw.category = Category.PD;

    mergedData.push(raw);

    postXHR({
        url: ctx.core.url + '/api/prajna',
        data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=pd',
        success: () => {
            ls.set(CacheKey.PD, []);
        },
    });
}

function PDMiddleware(ctx: any, next: any): any {
    if (PD_FLAG) {
        PD_FLAG = false;
        GLOBAL.addEventListener("beforeunload", () => {
            _sendPDData(ctx);
        });
    }
    next();
}
export default PDMiddleware;
