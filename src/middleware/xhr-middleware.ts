const ls = require('local-storage');
import GLOBAL from '../util/global';
import Message from '../core/types/message.type';
import Resource from '../core/types/resource.type';
import getEntries, { PerformanceObserver } from '../util/getEntries';
import {
    LogLevel
} from '../core/types/log.type';
import { match } from '../util/utils';

let XHR_FLAG: boolean = true;

function _sendStorage(ctx: any): void {
    let cache: any = ls.get('prajna_cache_xhr') || [];
    let mergedData: Message[] = [];
    if (cache.length) {
        cache.forEach(function (e: Resource, i: number) {
            if (match(e.resourceUrl, ctx.core.ignore.ajax) === false) {
                let raw = ctx.inspect();
                e.pageId = ctx.core.pageId;
                e.pageUrl = GLOBAL.location.href;
                raw.xhr = e;
                mergedData.push(raw);
            }
        });
        let _xhr: XMLHttpRequest = new XMLHttpRequest();
        _xhr.open('POST', ctx.core.url + '/api/prajna', true);
        _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        _xhr.onreadystatechange = function (e) {
            if (_xhr.readyState == 4) {
                if (_xhr.status == 200) {
                    ls.set('prajna_cache_xhr', []);
                }
            }
        };
        _xhr.onerror = function (e) { console.log(e); };
        if (mergedData.length) {
            _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=xhr');
        }
    }
}

function _xhrRuntime(ctx: any): void {
    GLOBAL.addEventListener("load", () => {
        GLOBAL.__XHR_ON_LOAD__ = true;
        _sendStorage(ctx);
        const xhr: any = GLOBAL.XMLHttpRequest;
        const _send: any = xhr.prototype.send;
        let xhrInstance: any = {};
        xhr.prototype.send = function () {
            this.addEventListener('readystatechange', function () {
                switch (this.readyState) {
                    case 2:
                        xhrInstance.unix = +new Date();
                        xhrInstance.resourceUrl = this.responseURL;
                        break;
                    case 3: break;
                    case 4:
                        if (this.status > 100) {
                            let cache: any = ls.get('prajna_cache_xhr') || [];
                            let mergedData: Message[] = [];
                            let raw = ctx.inspect();
                            if (match(xhrInstance.resourceUrl, ctx.core.ignore.ajax) === false) {
                                xhrInstance.status = this.status;
                                xhrInstance.responsetime = +new Date() - xhrInstance.unix;
                                xhrInstance.pageId = ctx.core.pageId;
                                xhrInstance.pageUrl = GLOBAL.location.href;
                                raw.xhr = xhrInstance;
                                mergedData.push(raw);
                                let _xhr: XMLHttpRequest = new XMLHttpRequest();
                                _xhr.open('POST', ctx.core.url + '/api/prajna', true);
                                _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                _xhr.onreadystatechange = function (e) {
                                    if (_xhr.readyState == 4) {
                                        if (_xhr.status == 200) {
                                            ls.set('prajna_cache_xhr', []);
                                        } else {
                                            cache.push(xhrInstance);
                                            ls.set('prajna_cache_xhr', cache);
                                        }
                                    }
                                };
                                _xhr.onerror = function (e) { console.log(e); };
                                if (mergedData.length) {
                                    console.log(mergedData);
                                    _xhr.send('data=' + encodeURIComponent(JSON.stringify(mergedData)) + '&type=xhr');
                                }
                                if (xhrInstance.status > 400) {
                                    ctx.core.emit(LogLevel.ERROR);
                                }
                            }
                        }
                        break;
                    default: break;
                }
            });
            return _send.apply(this, arguments);
        };
    });
}

function XHRMiddleware(ctx: any, next: any): any {
    if (XHR_FLAG) {
        XHR_FLAG = false;
        _xhrRuntime(ctx);
    }
    next();
}

export default XHRMiddleware;
