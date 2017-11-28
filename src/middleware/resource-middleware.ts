const ls = require('local-storage');
import GLOBAL from '../util/global';
import Message from '../core/types/message.type';
import Resource from '../core/types/resource.type';
import getEntries, { PerformanceObserver } from '../util/getEntries';
import {
    LogLevel
} from '../core/types/log.type';
import { match } from '../util/utils';

let FORMER_RESOURCE_FLAG: boolean = true;
let ENTRY_SIZE = 0;

let findResource = function (ctx: any, ent: PerformanceEntry[]): PerformanceEntry[] {
    let res: any[] = [];
    ent.map((e: any, i: number) => {
        if (e.entryType === "resource" &&
            match(e.name, ctx.core.ignore.resource) === false &&
            e.initiatorType !== "xmlhttprequest" &&
            e.initiatorType !== "beacon") {
            let strE = JSON.stringify(e);
            let _e = JSON.parse(strE); // copy
            _e.resourceUrl = _e.name;
            _e.unix = +new Date();
            _e.pageId = ctx.core.pageId;
            _e.pageUrl = GLOBAL.location.href;
            _e.status = 200;
            _e.responsetime = _e.duration;
            delete _e.name;
            delete _e.duration;
            if (!match(_e.resourceUrl, ctx.core.ignore.resource)) {
                res.push(_e);
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
        let mergedData: Message[] = [];
        resources.map((e: any, i: number) => {
            mergedData.push(Object.assign(ctx.inspect(), { resource: e }));
        });

        let _xhr: XMLHttpRequest = new XMLHttpRequest();
        _xhr.open('POST', ctx.core.url + '/api/prajna', true);
        _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        _xhr.onreadystatechange = function (e) {
            if (_xhr.readyState === 4) {
                if (_xhr.status !== 200) {
                    let cache: any = ls.get('prajna_cache_resource') || [];
                    for (let i: number = 0; i < resources.length; i++) {
                        cache.push(resources[i]);
                    }
                    ls.set('prajna_cache_resource', cache);
                }
            }
        };
        _xhr.onerror = function (e) { console.log(e); };
        _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=resource&status=success');
    }
}

function reportUnloaded(ctx: any) {
    let cache: any = ls.get('prajna_cache_resource') || [];
    cache = cache.filter((e: any) => {
        return !match(e.resourceUrl, ctx.core.ignore);
    });
    let mergedData: Message[] = [];
    if (cache.length) {
        cache.forEach(function (e: Resource, i: number) {
            let raw = ctx.inspect();
            e.pageId = e.pageId ? e.pageId : ctx.core.pageId;
            e.pageUrl = e.pageUrl ? e.pageUrl : GLOBAL.location.href;
            raw.resource = e;
            mergedData.push(raw);
        });
        ctx.core.emit(LogLevel.ERROR);
        let _xhr: XMLHttpRequest = new XMLHttpRequest();
        _xhr.open('POST', ctx.core.url + '/api/prajna', true);
        _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        _xhr.onreadystatechange = function (e) {
            if (_xhr.readyState == 4) {
                if (_xhr.status == 200) {
                    cache = [];
                    ls.set('prajna_cache_resource', cache);
                } else { }		// nothing to do
            } else { }			// nothing to do
        };
        _xhr.onerror = function (e) { console.log(e); };
        _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=resource&status=failed');
    }
}

function _resourceRuntime(ctx: any): void {
    GLOBAL.addEventListener("load", () => {
        GLOBAL.__RESOURCE_ON_LOAD__ = true; // 关闭 gadget 里的逻辑
        if (getEntries) {
            reportUnloaded(ctx);
            reportLoaded(ctx, GLOBAL.performance.getEntriesByType('resource'));
        }
        GLOBAL.addEventListener("error", (e: any) => {
            let target = e.target || e.srcElement;
            if (target instanceof Window) { return; }
            let url = target.src || target.href;
            if (['SCRIPT', 'LINK', 'IMG', 'STYLE', 'IFRAME', 'HTML'].indexOf(target.nodeName) !== -1 &&
                !match(target.src || target.href, ctx.core.ignore)) {
                ctx.core.emit(LogLevel.ERROR);
                let mergedData: Message[] = [];
                let body = {
                    unix: +new Date(),
                    status: 404,
                    resourceUrl: target.src || target.href,
                    pageId: ctx.core.pageId,
                    pageUrl: GLOBAL.location.href
                };
                let message = ctx.inspect();
                message.resource = body;
                mergedData.push(message);
                let _xhr: XMLHttpRequest = new XMLHttpRequest();
                _xhr.open('POST', ctx.core.url + '/api/prajna', true);
                _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                _xhr.onreadystatechange = function (e) {
                    if (_xhr.readyState == 4) {
                        if (_xhr.status == 200) { } else {
                            let cache: any = ls.get('prajna_cache_resource') || [];
                            if (cache.length) { cache.push(body); }
                            else {
                                let r: any[] = [];
                                r.push(body);
                                cache = r;
                            }
                            ls.set('prajna_cache_resource', cache);
                        }
                    }
                };
                _xhr.onerror = function (e) { console.log(e); };
                _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=resource&status=failed');
            }
        }, true);
        if (getEntries && PerformanceObserver) {
            const observer = new PerformanceObserver((list: any) => {
                for (const entry of list.getEntries()) {
                    let resources: PerformanceEntry[] = [entry];
                    reportLoaded(ctx, resources);
                }
            });
            observer.observe({ entryTypes: ['resource'] });
        }
    });
}

function resourceMiddleware(ctx: any, next: any): any {
    console.log("resourceMiddleware")
    if (FORMER_RESOURCE_FLAG) {
        FORMER_RESOURCE_FLAG = false;
        _resourceRuntime(ctx);
    }
    next();
}

export default resourceMiddleware;
