const ls = require('local-storage');
import GLOBAL from '../util/global';
import getEntries from '../util/getEntries';
import Message from '../core/types/message.type';
import Performance, {
    PerformanceNavigationTiming,
    PerformancePaintTiming
} from '../core/types/performance.type';

let AUTOPV_FLAG: boolean = true;

function _sendPVData(ctx: any, padding?: any) {
    let cache: any = ls.get('prajna_cache_pv') || [];
    let mergedData: Message[] = [];
    let ptiming: any = getEntries ? GLOBAL.performance.timing : void (0);
    let pnavigation: any = getEntries ? GLOBAL.performance.navigation : void (0);
    let performanceNavigation: Performance = Object.assign({
        pageUrl: ctx.core.pageUrl,
        pageId: ctx.core.pageId,
        navigation: pnavigation,
    }, (getEntries ? {
        timing: {
            connectEnd: (ptiming.connectEnd === 0 ? ptiming.connectEnd : ptiming.connectEnd - ptiming.navigationStart),
            connectStart: (ptiming.connectStart === 0 ? ptiming.connectStart : ptiming.connectStart - ptiming.navigationStart),
            domComplete: (ptiming.domComplete === 0 ? ptiming.domComplete : ptiming.domComplete - ptiming.navigationStart),
            domContentLoadedEventEnd: (ptiming.domContentLoadedEventEnd === 0 ? ptiming.domContentLoadedEventEnd : ptiming.domContentLoadedEventEnd - ptiming.navigationStart),
            domContentLoadedEventStart: (ptiming.domContentLoadedEventStart === 0 ? ptiming.domContentLoadedEventStart : ptiming.domContentLoadedEventStart - ptiming.navigationStart),
            domInteractive: (ptiming.domInteractive === 0 ? ptiming.domInteractive : ptiming.domInteractive - ptiming.navigationStart),
            domLoading: (ptiming.domLoading === 0 ? ptiming.domLoading : ptiming.domLoading - ptiming.navigationStart),
            domainLookupEnd: (ptiming.domainLookupEnd === 0 ? ptiming.domainLookupEnd : ptiming.domainLookupEnd - ptiming.navigationStart),
            domainLookupStart: (ptiming.domainLookupStart === 0 ? ptiming.domainLookupStart : ptiming.domainLookupStart - ptiming.navigationStart),
            fetchStart: (ptiming.fetchStart === 0 ? ptiming.fetchStart : ptiming.fetchStart - ptiming.navigationStart),
            loadEventEnd: (ptiming.loadEventEnd === 0 ? ptiming.loadEventEnd : ptiming.loadEventEnd - ptiming.navigationStart),
            loadEventStart: (ptiming.loadEventStart === 0 ? ptiming.loadEventStart : ptiming.loadEventStart - ptiming.navigationStart),
            navigationStart: (ptiming.navigationStart === 0 ? ptiming.navigationStart : ptiming.navigationStart - ptiming.navigationStart),
            redirectEnd: (ptiming.redirectEnd === 0 ? ptiming.redirectEnd : ptiming.redirectEnd - ptiming.navigationStart),
            redirectStart: (ptiming.redirectStart === 0 ? ptiming.redirectStart : ptiming.redirectStart - ptiming.navigationStart),
            requestStart: (ptiming.requestStart === 0 ? ptiming.requestStart : ptiming.requestStart - ptiming.navigationStart),
            responseEnd: (ptiming.responseEnd === 0 ? ptiming.responseEnd : ptiming.responseEnd - ptiming.navigationStart),
            responseStart: (ptiming.responseStart === 0 ? ptiming.responseStart : ptiming.responseStart - ptiming.navigationStart),
            secureConnectionStart: (ptiming.secureConnectionStart === 0 ? ptiming.secureConnectionStart : ptiming.secureConnectionStart - ptiming.navigationStart),
            unloadEventEnd: (ptiming.unloadEventEnd === 0 ? ptiming.unloadEventEnd : ptiming.unloadEventEnd - ptiming.navigationStart),
            unloadEventStart: (ptiming.unloadEventStart === 0 ? ptiming.unloadEventStart : ptiming.unloadEventStart - ptiming.navigationStart),
        },
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
    } : {}));
    if (cache && cache.length) {
        cache.forEach((e: any, i: number) => {
            let raw: Message = ctx.inspect();
            e.name = ctx.core.pageId;
            if (i == cache.length - 1) { // last one
                if (padding) {
                    e.padding = padding;
                }
                raw.performance = performanceNavigation;
            }
            raw.pv = e;
            mergedData.push(raw);
        });
    } else {
        let raw: Message = ctx.inspect();
        raw.pv = {
            pageId: ctx.core.pageId,
            auto: GLOBAL.__prajnaAutoPV__,
            referUrl: GLOBAL.document.referrer,
            unix: (+new Date()),
            url: GLOBAL.location.href,
        };
        if (padding) {
            raw.pv.padding = padding;
        }
        raw.performance = performanceNavigation;
        mergedData.push(raw);
    }

    // console.log(mergedData);

    let _xhr: XMLHttpRequest = new XMLHttpRequest();
    _xhr.open('POST', ctx.core.url, true);
    _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    _xhr.onreadystatechange = function (e) {
        if (_xhr.readyState == 4) {
            if (_xhr.status == 200) {
                cache = [];
                ls.set('prajna_cache_pv', cache);
            } else {
                // TODO: 存入 localstorage
            }
        } else {
            // TODO: 存入 localstorage
        }
    };
    _xhr.onerror = function (e) {
        console.log(e);
    };
    _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=pv');
}

function PVMiddleware(ctx: any, next: any): any {
    ctx.core.pageView = function (padding: any): void {
        if (GLOBAL.document.readyState === 'complete') {
            // ctx.core.beat();
            _sendPVData(ctx, padding);
        } else {
            const _pv = function () {
                setTimeout(() => {
                    // ctx.core.beat();
                    _sendPVData(ctx, padding);
                }, 0);
            };
            window.addEventListener("load", _pv);
        }
    };
    if (AUTOPV_FLAG && ctx.core.autopv) {
        AUTOPV_FLAG = false;
        GLOBAL.addEventListener("load", function () {
            setTimeout(() => {
                _sendPVData(ctx);
            }, 0);
        });
    }
    next();
}

export default PVMiddleware;
