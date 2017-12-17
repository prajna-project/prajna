const ls = require('local-storage');

import GLOBAL from '../util/global';
import postXHR from '../util/xhr';

import Category, { CacheKey } from '../core/types/category.type';
import Message from '../core/types/message.type';
import PV from '../core/types/pv.type';

let AUTOPV_FLAG: boolean = true;

function _sendPVData(ctx: any, padding?: any) {
    const cache: PV = {
        name: '',
        auto: GLOBAL.__prajnaAutoPV__,
        referUrl: GLOBAL.document.referrer,
        unix: (+new Date()),
        url: GLOBAL.location.href,
    };

    const mergedData: Message[] = [];

    const raw: Message = ctx.inspect();
    cache.name = ctx.core.pageId;
    if (padding) {
        cache.padding = padding;
    }
    raw.category = Category.PV;
    // raw.performance = performanceNavigation;
    raw.pv = cache;
    mergedData.push(raw);

    postXHR({
        url: ctx.core.url + '/api/prajna',
        data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=pv',
        success: () => {
            ls.set(CacheKey.PV, []);
        },
    });
}

function PVMiddleware(ctx: any, next: any): any {
    ctx.core.pageView = (padding: any): void => {
        if (GLOBAL.document.readyState === 'complete') {
            ctx.core.beat();
            _sendPVData(ctx, padding);
        } else {
            const pv = () => {
                setTimeout(() => {
                    ctx.core.beat();
                    _sendPVData(ctx, padding);
                }, 0);
            };
            GLOBAL.addEventListener("load", pv);
        }
    };
    if (AUTOPV_FLAG && ctx.core.autopv) {
        AUTOPV_FLAG = false;
        GLOBAL.addEventListener("load", () => {
            setTimeout(() => {
                _sendPVData(ctx);
            }, 0);
        });
    }
    next();
}

export default PVMiddleware;
