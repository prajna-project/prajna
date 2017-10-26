import { Timing, Navigation, Memory } from '../core/types/performance.type';
import GLOBAL from '../util/global';

let PERFORMANCE_FLAG: boolean = true;

function _sendPerformanceData(ctx: any) {
    let time = new Date();
    let data: any[] = [];
    let performance: any = GLOBAL.performance,
        timing: Timing = performance.timing,
        navigation: Navigation = performance.navigation,
        memory: Memory = performance.memory;
    // const deltaTiming = {
    //     connectEnd: GLOBAL.performance.timing.connectEnd === 0 ? 0 : GLOBAL.performance.timing.connectEnd - GLOBAL.performance.timing.navigationStart,
    //     connectStart: GLOBAL.performance.timing.connectStart === 0 ? 0 : GLOBAL.performance.timing.connectStart - GLOBAL.performance.timing.navigationStart,
    //     domComplete: GLOBAL.performance.timing.domComplete === 0 ? 0 : GLOBAL.performance.timing.domComplete - GLOBAL.performance.timing.navigationStart,
    //     domContentLoadedEventEnd: GLOBAL.performance.timing.domContentLoadedEventEnd === 0 ? 0 : GLOBAL.performance.timing.domContentLoadedEventEnd - GLOBAL.performance.timing.navigationStart,
    //     domContentLoadedEventStart: GLOBAL.performance.timing.domContentLoadedEventStart === 0 ? 0 : GLOBAL.performance.timing.domContentLoadedEventStart - GLOBAL.performance.timing.navigationStart,
    //     domInteractive: GLOBAL.performance.timing.domInteractive === 0 ? 0 : GLOBAL.performance.timing.domInteractive - GLOBAL.performance.timing.navigationStart,
    //     domLoading: GLOBAL.performance.timing.domLoading === 0 ? 0 : GLOBAL.performance.timing.domLoading - GLOBAL.performance.timing.navigationStart,
    //     domainLookupEnd: GLOBAL.performance.timing.domainLookupEnd === 0 ? 0 : GLOBAL.performance.timing.domainLookupEnd - GLOBAL.performance.timing.navigationStart,
    //     domainLookupStart: GLOBAL.performance.timing.domainLookupStart === 0 ? 0 : GLOBAL.performance.timing.domainLookupStart - GLOBAL.performance.timing.navigationStart,
    //     fetchStart: GLOBAL.performance.timing.fetchStart === 0 ? 0 : GLOBAL.performance.timing.fetchStart - GLOBAL.performance.timing.navigationStart,
    //     loadEventEnd: GLOBAL.performance.timing.loadEventEnd === 0 ? 0 : GLOBAL.performance.timing.loadEventEnd - GLOBAL.performance.timing.navigationStart,
    //     loadEventStart: GLOBAL.performance.timing.loadEventStart === 0 ? 0 : GLOBAL.performance.timing.loadEventStart - GLOBAL.performance.timing.navigationStart,
    //     navigationStart: GLOBAL.performance.timing.navigationStart === 0 ? 0 : GLOBAL.performance.timing.navigationStart - GLOBAL.performance.timing.navigationStart,
    //     redirectEnd: GLOBAL.performance.timing.redirectEnd === 0 ? 0 : GLOBAL.performance.timing.redirectEnd - GLOBAL.performance.timing.navigationStart,
    //     redirectStart: GLOBAL.performance.timing.redirectStart === 0 ? 0 : GLOBAL.performance.timing.redirectStart - GLOBAL.performance.timing.navigationStart,
    //     requestStart: GLOBAL.performance.timing.requestStart === 0 ? 0 : GLOBAL.performance.timing.requestStart - GLOBAL.performance.timing.navigationStart,
    //     responseEnd: GLOBAL.performance.timing.responseEnd === 0 ? 0 : GLOBAL.performance.timing.responseEnd - GLOBAL.performance.timing.navigationStart,
    //     responseStart: GLOBAL.performance.timing.responseStart === 0 ? 0 : GLOBAL.performance.timing.responseStart - GLOBAL.performance.timing.navigationStart,
    //     secureConnectionStart: GLOBAL.performance.timing.secureConnectionStart === 0 ? 0 : GLOBAL.performance.timing.secureConnectionStart - GLOBAL.performance.timing.navigationStart,
    //     unloadEventStart: GLOBAL.performance.timing.unloadEventStart === 0 ? 0 : GLOBAL.performance.timing.unloadEventStart - GLOBAL.performance.timing.navigationStart,
    //     unloadEventEnd: GLOBAL.performance.timing.unloadEventEnd === 0 ? 0 : GLOBAL.performance.timing.unloadEventEnd - GLOBAL.performance.timing.navigationStart
    // }
    // console.log(deltaTiming);
    let msg = {
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
        'performance': {
            pageUrl: GLOBAL.location.href,
            timing: timing,
            navigation: navigation,
            memory: memory
        }
    };
    data.push(msg);
    console.log(data);
    let _xhr: XMLHttpRequest = new XMLHttpRequest();
    _xhr.open('POST', ctx.core.url + '/api/prajna', true);
    _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    _xhr.onload = function (e) {
        // TODO:
    };
    _xhr.onerror = function (e) {
        console.log(e);
    };
    _xhr.send(JSON.stringify(data));
}

function performanceMiddleware(ctx: any, next: any): any {
    ctx.runtime.performance = GLOBAL.performance;
    console.log('use performance-middleware');

    if (PERFORMANCE_FLAG) {
        PERFORMANCE_FLAG = false;
        _sendPerformanceData(ctx);
        ctx.core.beat();
    }

    next();
}

export default performanceMiddleware;
