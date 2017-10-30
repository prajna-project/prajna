const ls = require('local-storage');
import Message from '../core/types/message.type';
import Log, {
    Category,
    LogLevel
} from '../core/types/log.type';
const only = require('only');

interface reportOptions {
    level?: LogLevel,
    name?: string,
    padding?: any,
    content: string
}

function reportMiddleware(ctx: any, next: any): any {
    ctx.core.report = function (opts: reportOptions) {
        let cache: any = ls.get('prajna_cache') || {};
        let cachedLog: Log[] = cache.log || [];
        let mergedData: Message[] = [];
        cachedLog.push(Object.assign({
            unix: +new Date(),
            category: Category.REPORT,
            name: 'prajna-report',
            level: LogLevel.ERROR,
            pageUrl: ctx.core.pageUrl,
            pageId: ctx.core.pageId,
            padding: {},
            resourceUrl: ''
        }, only(opts, ['level', 'name', 'padding', 'content'])));
        cachedLog.forEach((e: Log, i: number) => {
            mergedData.push(Object.assign(ctx.inspect(), {
                log: e
            }));
        });

        let _xhr: XMLHttpRequest = new XMLHttpRequest();
        _xhr.open('POST', ctx.core.url + '/api/prajna', true);
        _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        _xhr.onreadystatechange = function (e) {
            if (_xhr.readyState == 4) {
                if (_xhr.status == 200) {
                    cache.log = [];
                    ls.set('prajna_cache', cache);
                } else {
                    cache.log = cachedLog;
                    ls.set('prajna_cache', cache);
                }
            } else {
                cache.log = cachedLog;
                ls.set('prajna_cache', cache);
            }
        };
        _xhr.onerror = function (e) { console.log(e); };
        _xhr.send('data=' + JSON.stringify(mergedData));
    };
    next();
}

export default reportMiddleware;
