const ls = require('local-storage');
import GLOBAL from '../util/global';

let AUTOPV_FLAG: boolean = true;

function _sendPVData(ctx: any) {
    let cache: any = ls.get('prajna_cache');
    let mergedData: any[] = [];
    cache.pv.forEach((e: any) => {
        let raw = ctx.inspect();
        e.name = ctx.core.pageId;
        raw.pv = e;
        mergedData.push(raw);
    });
    console.log(mergedData);
    let _xhr: XMLHttpRequest = new XMLHttpRequest();
    _xhr.open('POST', ctx.core.url + '/api/prajna', true);
    _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    _xhr.onload = function (e) {
        cache.pv = [];
        ls.set('prajna_cache', cache);
    };
    _xhr.onerror = function (e) {
        console.log(e);
    };
    _xhr.send(JSON.stringify(mergedData));
}

function PVMiddleware(ctx: any, next: any): any {
    // console.log('use pv-middleware');
    function pageView() {
        if (GLOBAL.document.readyState === 'complete') {
            ctx.core.beat();
            _sendPVData(ctx);
        } else {
            const wof = window.onload;
            window.onload = function () {
                ctx.core.beat();
                _sendPVData(ctx);
                return wof.apply(this);
            }
        }
    }
    ctx.core.pageView = pageView;
    if (AUTOPV_FLAG && ctx.core.autopv) {
        AUTOPV_FLAG = false;
        const wof = window.onload;
        window.onload = function () {
            _sendPVData(ctx);
            return wof.apply(this);
        }
    }
    next();
}

export default PVMiddleware;
