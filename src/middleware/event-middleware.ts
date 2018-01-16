const ls = require('local-storage');
import Message from '../core/types/message.type';
import GLOBAL from '../util/global';
import Log, { Category, LogLevel } from '../core/types/log.type';

let EVENT_FLAG: boolean = true;
function eventMiddleware(ctx: any, next: any): any {
    function eventMethodFactory(category: Category) {
        return function (name: string, padding?: any) {
            ctx.core.emit(LogLevel.INFO);
            ctx.core.beat();
            let cache: Log[] = ls.get('prajna_cache_log') || [];
            let mergedData: Message[] = [];
            cache.push({
                unix: +new Date(),
                category: category,
                name: name,
                content: '',
                level: LogLevel.INFO,
                pageUrl: ctx.core.pageUrl,
                pageId: ctx.core.pageId,
                padding: padding || {},
                resourceUrl: ''
            });
            cache.forEach((e: Log, i: number) => {
                mergedData.push(Object.assign(ctx.inspect(), { log: e }));
            });

            let _xhr: XMLHttpRequest = new XMLHttpRequest();
            _xhr.open('POST', ctx.core.url, true);
            _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            _xhr.onreadystatechange = function (e) {
                if (_xhr.readyState == 4) {
                    if (_xhr.status == 200) {
                        cache = [];
                        ls.set('prajna_cache_log', cache);
                    }
                } else {
                    ls.set('prajna_cache_log', cache);
                }
            };
            _xhr.onerror = function (e) { console.log(e); };
            _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=event');
        };
    }

    if (EVENT_FLAG) {
        EVENT_FLAG = false;
        ctx.core.moduleClick = eventMethodFactory(Category.MODULE_CLICK);
        ctx.core.moduleView = eventMethodFactory(Category.MODULE_VIEW);
        ctx.core.moduleEdit = eventMethodFactory(Category.MODULE_EDIT);
    }

    next();
}

export default eventMiddleware;
