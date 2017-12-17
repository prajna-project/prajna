const ls = require('local-storage');

import Category, { CacheKey } from '../core/types/category.type';
import { LogLevel } from '../core/types/log.type';
import Message from '../core/types/message.type';
import Resource from '../core/types/resource.type';

import getEntries, { PerformanceObserver } from '../util/getEntries';
import GLOBAL from '../util/global';
import { match } from '../util/utils';
import postXHR from '../util/xhr';

let FORMER_RESOURCE_FLAG: boolean = true;

const findResource = (ctx: any, ent: PerformanceEntry[]): PerformanceEntry[] => {
    const res: any[] = [];
    ent.map((e: any, i: number) => {
        if (e.entryType === "resource" &&
            match(e.name, ctx.core.ignore.resource) === false &&
            e.initiatorType !== "xmlhttprequest" &&
            e.initiatorType !== "beacon") {
            const raw: Resource = {
                resourceUrl: e.name,
                unix: +new Date(),
                pageId: ctx.core.pageId,
                pageUrl: GLOBAL.location.href,
                status: 200,
                responsetime: Math.ceil(e.duration),
            };
            if (!match(raw.resourceUrl, ctx.core.ignore.resource)) {
                res.push(raw);
            }
        }
    });
    return res;
};

function reportLoaded(ctx: any, resources: PerformanceEntry[]) {
    resources = findResource(ctx, resources).filter((e: any) => {
        if (e.initiatorType !== 'beacon' && e.initiatorType !== 'xmlhttprequest') {
            return true;
        }
    });
    if (resources.length) {
        const mergedData: Message[] = [];
        resources.map((e: any, i: number) => {
            mergedData.push(Object.assign(ctx.inspect(), { resource: e }, { category: Category.RESOURCE }));
        });

        postXHR({
            url: ctx.core.url + '/api/prajna',
            data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=resource&status=success',
            success: () => {
                ls.set(CacheKey.RESOURCE, []);
            },
        });
    }
}

function _resourceRuntime(ctx: any): void {
    // report resource of statusCode 404
    GLOBAL.addEventListener("error", (e: any) => {
        const target = e.target || e.srcElement;
        if (target instanceof Window) { return; }
        const url = target.src || target.href;
        if (['SCRIPT', 'LINK', 'IMG', 'STYLE', 'IFRAME', 'HTML'].indexOf(target.nodeName) !== -1
            && !match(target.src || target.href, ctx.core.ignore)) {
            ctx.core.emit(LogLevel.ERROR);

            const mergedData: Message[] = [];
            const body: Resource = {
                unix: +new Date(),
                status: 404,
                resourceUrl: target.src || target.href,
                pageId: ctx.core.pageId,
                pageUrl: GLOBAL.location.href,
            };

            const raw: Message = ctx.inspect();
            raw.resource = body;
            raw.category = Category.RESOURCE;
            mergedData.push(raw);

            postXHR({
                url: ctx.core.url + '/api/prajna',
                data: 'data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=resource&status=failed',
                success: () => {
                    ls.set(CacheKey.RESOURCE, []);
                },
                failure: () => {
                    ls.set(CacheKey.RESOURCE, []);
                },
            });
        }
    }, true);

    // report resource of statusCode 200
    GLOBAL.addEventListener("load", () => {
        GLOBAL.__RESOURCE_ON_LOAD__ = true; // 关闭 gadget 里的逻辑
        if (getEntries) {
            reportLoaded(ctx, GLOBAL.performance.getEntriesByType('resource'));
        }
        if (getEntries && PerformanceObserver) {
            const observer = new PerformanceObserver((list: any) => {
                for (const entry of list.getEntries()) {
                    const resources: PerformanceEntry[] = [entry];
                    reportLoaded(ctx, resources);
                }
            });
            observer.observe({ entryTypes: ['resource'] });
        }
    });
}

function ResourceMiddleware(ctx: any, next: any): any {
    if (FORMER_RESOURCE_FLAG) {
        FORMER_RESOURCE_FLAG = false;
        _resourceRuntime(ctx);
    }
    next();
}

export default ResourceMiddleware;
