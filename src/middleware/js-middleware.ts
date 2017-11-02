const ls = require('local-storage');
import GLOBAL from '../util/global';
import Message from '../core/types/message.type';
import Log, {
    Category,
    LogLevel
} from '../core/types/log.type';

let FORMER_JSERROR_FLAG: boolean = true;

function _sendJSData(ctx: any) {
    ctx.core.emit(LogLevel.ERROR);
    ctx.core.beat();
    let cache: any = ls.get('prajna_cache');
    let mergedData: Message[] = [];
    if (cache.js.length) {
        cache.js.forEach((e: any, i: number) => {
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
        let _xhr: XMLHttpRequest = new XMLHttpRequest();
        _xhr.open('POST', ctx.core.url + '/api/prajna', true);
        _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        _xhr.onreadystatechange = function (e) {
            if (_xhr.readyState == 4) {
                if (_xhr.status == 200) {
                    cache.js = [];
                    ls.set('prajna_cache', cache);
                } else { }
            } else { }
        };
        _xhr.onerror = function (e) { console.log(e); };
        _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)));
    }
}

function _JSRuntime(ctx: any) {
    const globalOnError = GLOBAL.onerror;
    GLOBAL.onerror = function (errorMessage: string, scriptURI: string, lineNumber: number, columnNumber: number, errorObj: any) {
        globalOnError && globalOnError.apply(GLOBAL, arguments);
        _sendJSData(ctx);
    };
}

function JSMiddleware(ctx: any, next: any): any {
    if (FORMER_JSERROR_FLAG) {
        FORMER_JSERROR_FLAG = false;
        _JSRuntime(ctx);
        _sendJSData(ctx);
    }
    next();
}

export default JSMiddleware;
