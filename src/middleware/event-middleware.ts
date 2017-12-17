const ls = require('local-storage');
import Category, { CacheKey } from '../core/types/category.type';
import Log, { LogLevel } from '../core/types/log.type';
import Message from '../core/types/message.type';
import postXHR from '../util/xhr';

let EVENT_FLAG: boolean = true;

function EventMiddleware(ctx: any, next: any): any {
    function eventMethodFactory(category: Category) {
        return (name: string, padding?: any) => {
            ctx.core.emit(LogLevel.INFO);
            ctx.core.beat();
            const cache: Log[] = [];
            const mergedData: Message[] = [];
            cache.push({
                unix: +new Date(),
                name,
                content: '',
                level: LogLevel.INFO,
                pageUrl: ctx.core.pageUrl,
                pageId: ctx.core.pageId,
                padding: padding || {},
                resourceUrl: '',
            });
            cache.forEach((e: Log, i: number) => {
                mergedData.push(Object.assign(ctx.inspect(), { log: e }, { category }));
            });

            postXHR({
                url: ctx.core.url + '/api/prajna',
                data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=event',
                success: () => {
                    ls.set(CacheKey.REPORT, []);
                },
            });
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

export default EventMiddleware;
