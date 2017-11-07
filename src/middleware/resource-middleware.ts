const ls = require('local-storage');
import GLOBAL from '../util/global';
import Message from '../core/types/message.type';
import Resource from '../core/types/resource.type';
import getEntries, { PerformanceObserver } from '../util/getEntries';

let FORMER_RESOURCE_FLAG: boolean = true;
let ENTRY_SIZE = 0;

function _sendEntries(ctx: any, ent: PerformanceEntry[]): void {
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
                e.resourceUrl = e.name;
                e.unix = +new Date();
                e.pageId = ctx.core.pageId;
                e.pageUrl = GLOBAL.location.href;
                e.status = 200;
                e.responsetime = e.duration;
                delete e.name;
                res.push(e);
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
                    // cache.log = [];
                    // ls.set('prajna_cache', cache);
                } else {
                    // cache.log = cachedLog;
                    // ls.set('prajna_cache', cache);
                }
            } else {
                // cache.log = cachedLog;
                // ls.set('prajna_cache', cache);
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
        setInterval(() => {
            if (getEntries) {
                _sendEntries(ctx, GLOBAL.performance.getEntries());
            }
        }, 2000);
    }
    next();
}

export default resourceMiddleware;
