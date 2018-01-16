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

let REPORT_FLAG: boolean = true;

function reportMiddleware(ctx: any, next: any): any {
    if (REPORT_FLAG) {
        REPORT_FLAG = false;
        ctx.core.report = function (opts: reportOptions) {
            ctx.core.emit(opts.level || LogLevel.ERROR);
            ctx.core.beat();

            let cache: Log[] = ls.get('prajna_cache_log') || [];
            let mergedData: Message[] = [];
            cache.push(Object.assign({
                unix: +new Date(),
                category: Category.REPORT,
                name: 'prajna-report',
                level: LogLevel.ERROR,
                pageUrl: ctx.core.pageUrl,
                pageId: ctx.core.pageId,
                padding: {},
                resourceUrl: ''
            }, only(opts, ['level', 'name', 'padding', 'content'])));
            cache.forEach((e: Log, i: number) => {
                mergedData.push(Object.assign(ctx.inspect(), {
                    log: e
                }));
            });

            let _xhr: XMLHttpRequest = new XMLHttpRequest();
            _xhr.open('POST', ctx.core.url, true);
            _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            _xhr.onreadystatechange = function (e) {
                if (_xhr.readyState == 4) {
                    if (_xhr.status == 200) {
                        ls.set('prajna_cache_log', []);
                    }
                } else {
                    ls.set('prajna_cache_log', cache);
                }
            };
            _xhr.onerror = function (e) { console.log(e); };
            _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=report');
        };
    }
    next();
}

export default reportMiddleware;
