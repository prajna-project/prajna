const ls = require('local-storage');
import GLOBAL from '../util/global';
import Message from '../core/types/message.type';
import Resource from '../core/types/resource.type';
import getEntries, { PerformanceObserver } from '../util/getEntries';
import {
    LogLevel
} from '../core/types/log.type';

let FORMER_RESOURCE_FLAG: boolean = true;
let ENTRY_SIZE = 0;

function _sendErrors(ctx: any) {
    let cache: any = ls.get('prajna_cache') || {};
    let cachedRes: Resource[] = cache.resource || [];
    let mergedData: Message[] = [];
    if (cachedRes.length) {
        cachedRes.forEach(function (e: Resource, i: number) {
            let raw = ctx.inspect();
            e.pageId = ctx.core.pageId;
            e.pageUrl = GLOBAL.location.href;
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
                    cache.resource = [];
                    ls.set('prajna_cache', cache);
                } else {
                    // TODO:
                }
            } else {
                // TODO:
            }
        };
        _xhr.onerror = function (e) { console.log(e); };
        _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)));
    }
}

function _sendEntries(ctx: any, ent: PerformanceEntry[]): void {
    _sendErrors(ctx);
    let match = function (name: string, whitelist: RegExp[]) {
        for (let i: number = 0; i < whitelist.length; i++) {
            if (whitelist[i].test(name) === true) {
                return true;
            }
        }
        return false;
    };
    let findResource = function (ent: PerformanceEntry[]): PerformanceEntry[] {
        let res: any[] = [];
        ent.map((e: any, i: number) => {
            if (e.entryType === "resource" &&
                match(e.name, ctx.core.whitelist) === false &&
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
                res.push(_e);
            }
        });
        return res;
    };
    let delta: PerformanceEntry[] = [];
    ent.map((e: PerformanceEntry, i: number) => {
        if (i >= ENTRY_SIZE) {
            delta.push(e);
        }
    });
    ENTRY_SIZE = ent.length;
    let resources: PerformanceEntry[] = findResource(delta);
    if (resources.length) {
        let mergedData: Message[] = [];
        resources.map((e: any, i: number) => {
            mergedData.push(Object.assign(ctx.inspect(), { resource: e }));
        });

        let _xhr: XMLHttpRequest = new XMLHttpRequest();
        _xhr.open('POST', ctx.core.url + '/api/prajna', true);
        _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        _xhr.onreadystatechange = function (e) {
            if (_xhr.readyState == 4) {
                if (_xhr.status == 200) {
                    // TODO:
                } else {
                    let cache: any = ls.get('prajna_cache') || {};
                    let cachedRes: any[] = cache.resource || [];
                    for (let i: number = 0; i < resources.length; i++) {
                        cachedRes.push(resources[i]);
                    }
                    cache.resource = cachedRes;
                    ls.set('prajna_cache', cache);
                }
            } else {
                let cache: any = ls.get('prajna_cache') || {};
                let cachedRes: any[] = cache.resource || [];
                for (let i: number = 0; i < resources.length; i++) {
                    cachedRes.push(resources[i]);
                }
                cache.resource = cachedRes;
                ls.set('prajna_cache', cache);
            }
        };
        _xhr.onerror = function (e) { console.log(e); };
        _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)));
    }
}

function _resourceRuntime(ctx: any): void {
    GLOBAL.addEventListener("load", () => {
        if (getEntries) {
            let pEntry: PerformanceEntry[] = GLOBAL.performance.getEntries();
            _sendEntries(ctx, pEntry);
        }
    });
}

function resourceMiddleware(ctx: any, next: any): any {
    if (FORMER_RESOURCE_FLAG) {
        FORMER_RESOURCE_FLAG = false;
        _resourceRuntime(ctx);
        // if (PerformanceObserver) {
        // 	// TODO:
        // } else {
        //     // TODO:
        // }
        setInterval(() => {
            if (getEntries) {
                _sendEntries(ctx, GLOBAL.performance.getEntries());
            }
        }, 1000);
    }
    next();
}

export default resourceMiddleware;
