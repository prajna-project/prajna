const ls = require('local-storage');
import GLOBAL from '../util/global';
import Performance, {
    PerformanceNavigationTiming,
    PerformancePaintTiming
} from '../core/types/performance.type';

let AUTOPV_FLAG: boolean = true;

function _sendPVData(ctx: any) {
    let cache: any = ls.get('prajna_cache');
    let mergedData: any[] = [];
    let performanceNavigation: Performance = {
        pageUrl: GLOBAL.location.href,
        timing: GLOBAL.performance.timing,
        navigation: GLOBAL.performance.navigation,
        performanceNavigationTiming: (() => {
            let navigationTiming: PerformanceNavigationTiming;
            let entries = GLOBAL.performance.getEntries();
            entries.map((e: any, i: number) => {
                if (e.constructor.name === "PerformanceNavigationTiming") {
                    navigationTiming = e;
                }
            });
            return navigationTiming;
        })(),
        performancePaintTiming: (() => {
            let paintTiming: PerformancePaintTiming[] = [];
            let entries = GLOBAL.performance.getEntries();
            entries.map((e: any, i: number) => {
                if (e.constructor.name === "PerformancePaintTiming") {
                    paintTiming.push(e);
                }
            });
            return paintTiming;
        })()
    };
    if (cache.pv.length) {
        cache.pv.forEach((e: any, i: number) => {
            let raw = ctx.inspect();
            e.name = ctx.core.pageId;
            raw.pv = e;
            if (i == cache.pv.length - 1) { // last one
                raw.performanceNavigation = performanceNavigation;
            }
            mergedData.push(raw);
        });
    } else {
        let raw = ctx.inspect();
        raw.pv = {
            name: ctx.core.name,
            auto: GLOBAL.__prajnaAutoPV__,
            referUrl: GLOBAL.document.referrer,
            unix: (+new Date()),
            url: GLOBAL.location.href
        };
        raw.performanceNavigation = performanceNavigation;
        mergedData.push(raw);
    }

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
    _xhr.send('data=' + JSON.stringify(mergedData));
}

function PVMiddleware(ctx: any, next: any): any {
    // console.log('use pv-middleware');
    ctx.core.pageView = function () {
        if (GLOBAL.document.readyState === 'complete') {
            ctx.core.beat();
            _sendPVData(ctx);
        } else {
            const _pv = function () {
                setTimeout(() => {
                    ctx.core.beat();
                    _sendPVData(ctx);
                }, 0);
            };
            window.addEventListener("load", _pv);
        }
    };
    if (AUTOPV_FLAG && ctx.core.autopv) {
        AUTOPV_FLAG = false;
        window.addEventListener("load", function () {
            setTimeout(() => {
                _sendPVData(ctx);
            }, 0);
        });
    }
    next();
}

export default PVMiddleware;
