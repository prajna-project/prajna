const ls = require('local-storage');
import Message from '../core/types/message.type';
import Log, {
    Category,
    LogLevel
} from '../core/types/log.type';

function eventMiddleware(ctx: any, next: any): any {
    function eventMethodFactory(category: Category) {
        return function (name: string, padding?: any) {
            let cache: any = ls.get('prajna_cache') || {};
            let cachedLog: Log[] = cache.log || [];
            let mergedData: Message[] = [];
            cachedLog.push({
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
            cachedLog.forEach((e: Log, i: number) => {
                mergedData.push(Object.assign(ctx.inspect(), { log: e }));
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
            _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)));
        };
    }

    ctx.core.moduleClick = eventMethodFactory(Category.MODULE_CLICK);
    ctx.core.moduleView = eventMethodFactory(Category.MODULE_VIEW);
    ctx.core.moduleEdit = eventMethodFactory(Category.MODULE_EDIT);

    next();
}

export default eventMiddleware;
