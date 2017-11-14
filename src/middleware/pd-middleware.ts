const ls = require('local-storage');
import Message from '../core/types/message.type';
import GLOBAL from '../util/global';
import runtime from '../core/runtime';
import PD from '../core/types/pd.type';
let PD_FLAG: boolean = true;
function _sendPDData(ctx: any, duration: number, padding?: any) {
    let cache: any = ls.get('prajna_cache') || {};
    let cachedPD: PD[] = cache.pd || [];
    let mergedData: Message[] = [];
    cachedPD.push({
        pageId: ctx.core.pageId,                     // 页面名称
        unix: +new Date(),                  // unix 时间戳
        url: GLOBAL.location.href,                        // 页面 url
        duration: duration,                   // 页面停留时间
        padding: padding || {}                   // 附加信息
    });
    cachedPD.forEach((e: PD, i: number) => {
        mergedData.push(Object.assign(ctx.inspect(), { pd: e }));
    });

    let _xhr: XMLHttpRequest = new XMLHttpRequest();
    _xhr.open('POST', ctx.core.url + '/api/prajna', true);
    _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    _xhr.onreadystatechange = function (e) {
        if (_xhr.readyState == 4) {
            if (_xhr.status == 200) {
                cache.pd = [];
                ls.set('prajna_cache', cache);
            } else {
                cache.pd = cachedPD;
                ls.set('prajna_cache', cache);
            }
        } else {
            cache.pd = cachedPD;
            ls.set('prajna_cache', cache);
        }
    };
    _xhr.onerror = function (e) { console.log(e); };
    _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=pd');
}

function PDMiddleware(ctx: any, next: any): any {
    if (PD_FLAG) {
        PD_FLAG = false;
        GLOBAL.addEventListener("beforeunload", function () {
            _sendPDData(ctx, runtime.getDuration());
        });
    }
    next();
}
export default PDMiddleware;
