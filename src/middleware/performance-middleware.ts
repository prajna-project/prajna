import { Timing, Navigation, Memory } from '../core/types/performace.type';
const Global: Window = window;

let PERFORMANCE_FLAG: boolean = true;

function _sendPerformanceData(ctx: any) {
    let time = new Date();
    let data: any[] = [];
    let performance: any = Global.performance,
        timing: Timing = performance.timing,
        navigation: Navigation = performance.navigation,
        memory: Memory = performance.memory;
    // const deltaTiming = {
    //     connectEnd: Global.performance.timing.connectEnd === 0 ? 0 : Global.performance.timing.connectEnd - Global.performance.timing.navigationStart,
    //     connectStart: Global.performance.timing.connectStart === 0 ? 0 : Global.performance.timing.connectStart - Global.performance.timing.navigationStart,
    //     domComplete: Global.performance.timing.domComplete === 0 ? 0 : Global.performance.timing.domComplete - Global.performance.timing.navigationStart,
    //     domContentLoadedEventEnd: Global.performance.timing.domContentLoadedEventEnd === 0 ? 0 : Global.performance.timing.domContentLoadedEventEnd - Global.performance.timing.navigationStart,
    //     domContentLoadedEventStart: Global.performance.timing.domContentLoadedEventStart === 0 ? 0 : Global.performance.timing.domContentLoadedEventStart - Global.performance.timing.navigationStart,
    //     domInteractive: Global.performance.timing.domInteractive === 0 ? 0 : Global.performance.timing.domInteractive - Global.performance.timing.navigationStart,
    //     domLoading: Global.performance.timing.domLoading === 0 ? 0 : Global.performance.timing.domLoading - Global.performance.timing.navigationStart,
    //     domainLookupEnd: Global.performance.timing.domainLookupEnd === 0 ? 0 : Global.performance.timing.domainLookupEnd - Global.performance.timing.navigationStart,
    //     domainLookupStart: Global.performance.timing.domainLookupStart === 0 ? 0 : Global.performance.timing.domainLookupStart - Global.performance.timing.navigationStart,
    //     fetchStart: Global.performance.timing.fetchStart === 0 ? 0 : Global.performance.timing.fetchStart - Global.performance.timing.navigationStart,
    //     loadEventEnd: Global.performance.timing.loadEventEnd === 0 ? 0 : Global.performance.timing.loadEventEnd - Global.performance.timing.navigationStart,
    //     loadEventStart: Global.performance.timing.loadEventStart === 0 ? 0 : Global.performance.timing.loadEventStart - Global.performance.timing.navigationStart,
    //     navigationStart: Global.performance.timing.navigationStart === 0 ? 0 : Global.performance.timing.navigationStart - Global.performance.timing.navigationStart,
    //     redirectEnd: Global.performance.timing.redirectEnd === 0 ? 0 : Global.performance.timing.redirectEnd - Global.performance.timing.navigationStart,
    //     redirectStart: Global.performance.timing.redirectStart === 0 ? 0 : Global.performance.timing.redirectStart - Global.performance.timing.navigationStart,
    //     requestStart: Global.performance.timing.requestStart === 0 ? 0 : Global.performance.timing.requestStart - Global.performance.timing.navigationStart,
    //     responseEnd: Global.performance.timing.responseEnd === 0 ? 0 : Global.performance.timing.responseEnd - Global.performance.timing.navigationStart,
    //     responseStart: Global.performance.timing.responseStart === 0 ? 0 : Global.performance.timing.responseStart - Global.performance.timing.navigationStart,
    //     secureConnectionStart: Global.performance.timing.secureConnectionStart === 0 ? 0 : Global.performance.timing.secureConnectionStart - Global.performance.timing.navigationStart,
    //     unloadEventStart: Global.performance.timing.unloadEventStart === 0 ? 0 : Global.performance.timing.unloadEventStart - Global.performance.timing.navigationStart,
    //     unloadEventEnd: Global.performance.timing.unloadEventEnd === 0 ? 0 : Global.performance.timing.unloadEventEnd - Global.performance.timing.navigationStart
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
            pageUrl: Global.location.href,
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
    ctx.runtime.performance = Global.performance;
    console.log('use performance-middleware');

    if (PERFORMANCE_FLAG) {
        PERFORMANCE_FLAG = false;
        _sendPerformanceData(ctx);
        ctx.core.beat();
    }

    next();
}

export default performanceMiddleware;
