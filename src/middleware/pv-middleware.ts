const ls = require('local-storage');

let AUTOPV_FLAG: boolean = true;

function _sendPVData(ctx: any) {
    let time = new Date();
    let cache: any = ls.get('prajna_cache');
    let mergedData: any[] = [];
    cache.pv.forEach((e: any) => {
        e.name = ctx.core.pageId;
        mergedData.push({
            '@timestamp': time.toISOString(),
            'env': ctx.runtime.env,
            'project': ctx.runtime.project,
            'thirdParty': ctx.runtime.thirdParty,
            'version': ctx.runtime.version,
            'auto': ctx.runtime.auto,
            'channel': ctx.runtime.channel,
            'netowrk': ctx.runtime.netowrk,
            'jsBridge': ctx.runtime.jsBridge,
            'ua': ctx.runtime.ua,
            // 'region': ctx.runtime.region,
            'pv': e
        });
    });
    console.log(mergedData);
    let _xhr: XMLHttpRequest = new XMLHttpRequest();
    _xhr.open('POST', ctx.core.url + '/api/prajna', true);
    _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    _xhr.onload = function (e) {
        // cache.pv = [];
        // ls.set('prajna_cache', cache);
    };
    _xhr.onerror = function (e) {
        console.log(e);
    };
    _xhr.send(JSON.stringify(mergedData));
}

function PVMiddleware(ctx: any, next: any): any {
    console.log('use pv-middleware');
    function pageView() {
        ctx.core.beat();
        _sendPVData(ctx);
    }
    ctx.core.pageView = pageView;
    if (AUTOPV_FLAG && ctx.core.autopv) {
        AUTOPV_FLAG = false;
        _sendPVData(ctx);
    }
    next();
}

export default PVMiddleware;
