const ls = require('local-storage');
import GLOBAL from '../util/global';
import { hijackSend } from '../util/xhr';
import Message from '../core/types/message.type';
import Resource from '../core/types/resource.type';
import getEntries, { PerformanceObserver } from '../util/getEntries';
import {
    LogLevel
} from '../core/types/log.type';

let XHR_FLAG: boolean = true;

function _sendEntries(ctx: any, ent: PerformanceEntry[]): void {
    // TODO: performance.getEntries()
}

function _sendStorage(ctx: any): void {
    let cache: any = ls.get('prajna_cache');
    let cachedXHR: Resource[] = cache.xhr || [];
    let mergedData: Message[] = [];
    if (cachedXHR.length) {
        cachedXHR.forEach(function (e: Resource, i: number) {
            let raw = ctx.inspect();
            e.pageId = ctx.core.pageId;
            e.pageUrl = GLOBAL.location.href;
            raw.xhr = e;
            mergedData.push(raw);
        });
    }
    console.log(mergedData);
    let _xhr: XMLHttpRequest = new XMLHttpRequest();
    _xhr.open('POST', ctx.core.url + '/api/prajna', true);
    _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    _xhr.onreadystatechange = function (e) {
        if (_xhr.readyState == 4) {
            if (_xhr.status == 200) {
                cache.xhr = [];
                ls.set('prajna_cache', cache);
                console.log(ls.get('prajna_cache'));
            } else {
                // TODO:
            }
        } else {
            // TODO:
        }
    };
    _xhr.onerror = function (e) { console.log(e); };
    _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=xhr');

}

function _xhrRuntime(ctx: any): void {
    GLOBAL.addEventListener("load", () => {
        _sendStorage(ctx);	// 发送 localStorage 数据(全量)
    });
}

function XHRMiddleware(ctx: any, next: any): any {
    if (XHR_FLAG) {
        XHR_FLAG = false;

        // _xhrRuntime(ctx);

        // setInterval(() => {
        //     hijackSend(ctx);
        //     // _sendStorage(ctx);
        // }, 3000);
    }
    next();
}

export default XHRMiddleware;
