const ls = require('local-storage');
const only = require('only');

import postXHR from '../util/xhr';

import Category, { CacheKey } from '../core/types/category.type';
import Log, { LogLevel } from '../core/types/log.type';
import Message from '../core/types/message.type';

interface ReportOptions {
    level?: LogLevel;
    name?: string;
    padding?: any;
    content: string;
}

let REPORT_FLAG: boolean = true;

function ReportMiddleware(ctx: any, next: any): any {
    if (REPORT_FLAG) {
        REPORT_FLAG = false;
        ctx.core.report = (opts: ReportOptions) => {
            ctx.core.emit(opts.level || LogLevel.ERROR);
            ctx.core.beat();

            const cache: Log[] = ls.get(CacheKey.REPORT) || [];
            const mergedData: Message[] = [];
            cache.push(Object.assign({
                unix: +new Date(),
                name: 'prajna-report',
                level: LogLevel.ERROR,
                pageUrl: ctx.core.pageUrl,
                pageId: ctx.core.pageId,
                padding: {},
                resourceUrl: '',
            }, only(opts, ['level', 'name', 'padding', 'content'])));

            cache.forEach((e: Log, i: number) => {
                mergedData.push(Object.assign(ctx.inspect(), {
                    log: e,
                }, {
                    category: Category.REPORT,
                }));
            });

            postXHR({
                url: ctx.core.url + '/api/prajna',
                data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=report',
                success: () => {
                    ls.set(CacheKey.REPORT, []);
                },
                failure: () => {
                    ls.set(CacheKey.REPORT, []);
                },
            });
        };
    }
    next();
}

export default ReportMiddleware;
