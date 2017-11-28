const ls = require('local-storage');
import GLOBAL from '../util/global';
import Message from '../core/types/message.type';
import * as StackTrace from 'stacktrace-js';
import Log, {
    Category,
    LogLevel
} from '../core/types/log.type';

let FORMER_JSERROR_FLAG: boolean = true;

function _sendJSData(ctx: any) {
    // ctx.core.beat();
    let cache: any = ls.get('prajna_cache_js') || [];
    let mergedData: Message[] = [];
    console.log(cache,'这里是cache')
    if (cache && cache.length) {
        cache.forEach((e: any, i: number) => {
            let raw: any = ctx.inspect();
            raw.log = {
                unix: +new Date(),
                category: Category.SCRIPT,
                name: e.message,
                content: e.errorStack,
                level: LogLevel.ERROR,
                pageUrl: ctx.core.pageUrl,
                pageId: ctx.core.pageId,
                padding: {
                    lineNumber: e.lineNumber,
                    columnNumber: e.columnNumber,
                },
                resourceUrl: e.scriptURL
            };
            mergedData.push(raw);
        });
    }
    if (mergedData.length) {
        console.log("这里有mergedData",mergedData)
        let _xhr: XMLHttpRequest = new XMLHttpRequest();
        _xhr.open('POST', ctx.core.url + '/api/prajna', true);
        _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        _xhr.onreadystatechange = function (e) {
            if (_xhr.readyState == 4) {
                if (_xhr.status == 200) {
                    ls.set('prajna_cache_js', []);
                } else { }
            } else { }
        };
        _xhr.onerror = function (e) { console.log(e); };
        _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=js');
    }
}

function _JSRuntime(ctx: any) {
    const globalOnError = GLOBAL.onerror;
    const callback = function (stackframes: any): void {
        var stringifiedStack = stackframes.map(function (sf: any, i: number) {
            // if (i === 0) {
            //     let stackframe: any = new StackFrame({ fileName: sf.fileName, lineNumber: sf.lineNumber, columnNumber: sf.columnNumber });
            //     let callback: any = function myCallback(foundFunctionName: string) {
            //         // TODO:
            //     };
            //     let errback: any = function myErrback(error: Error) { console.log(StackTrace.fromError(error)); };
            //     let gps: any = new StackTraceGPS();
            //     gps.getMappedLocation(stackframe).then(callback, errback);
            // }
            return sf.toString();
        }).join('\n');
    };

    const errback = function (err: any) {
        console.log(err.message);
    };

    GLOBAL.onerror = function (errorMessage: string, scriptURI: string, lineNumber: number, columnNumber: number, errorObj: any) {
        // StackTrace.fromError(errorObj).then(callback).catch(errback);
        globalOnError && globalOnError.apply(GLOBAL, arguments);
        _sendJSData(ctx);
        ctx.core.emit(LogLevel.ERROR);
    };
    GLOBAL.addEventListener("unhandledrejection", function (event: any) {
        _sendJSData(ctx);
        ctx.core.emit(LogLevel.ERROR);
    });
}

function JSMiddleware(ctx: any, next: any): any {
    console.log("js-middleware")
    if (FORMER_JSERROR_FLAG) {
        FORMER_JSERROR_FLAG = false;
        _JSRuntime(ctx);
        _sendJSData(ctx);
    }
    next();
}

export default JSMiddleware;
