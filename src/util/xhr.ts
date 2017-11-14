/**
 * @fileOverview Re-write xhr open and send method，for hijack cat and lingxi's ajax
 * @name xhr.ts
 * @author Young Lee <youngleemails@gmail.com>
 * @license MIT
 */

import GLOBAL from './global';
import Log, {
    Category,
    LogLevel
} from '../core/types/log.type';
let nav: any = Navigator;
let xhr: any = GLOBAL.XMLHttpRequest;

function hijackSendBeacon(env: string): void {
    let _sd: any = nav.prototype.sendBeacon;
    let host: string = (env === 'beta' ? 'http://parjna.51ping.com' : 'http://prajna.sankuai.com');
    nav.prototype.sendBeacon = function (url: string, data: any) {
        let time = new Date();
        this.originUrl = url;
        this.originMethod = 'POST';
        let rawSendContent = arguments[0];
        if (/catfront.(dianping|51ping).com/.test(url)) {
            if (rawSendContent) {
                arguments[0] = `${host}/api/cat`;
                arguments[1] = {
                    "url": this.originUrl,
                    "method": this.originMethod,
                    "@timestamp": time.toISOString(),
                    "env": env,
                    "cat": data
                };
            }
        } else if (/report.meituan.com/.test(url)) {
            if (rawSendContent) {
                arguments[0] = `${host}/api/lingxi`;
                arguments[1] = {
                    "url": this.originUrl,
                    "method": this.originMethod,
                    "@timestamp": time.toISOString(),
                    "env": env,
                    "lingxi": data
                };
            }
        }
        return _sd.apply(this, arguments);
    };
}

/**
 * rewrite XMLHttpRequest.open
 */
function hijackOpen(env: string): void {
    let protocol: string = GLOBAL.location.protocol;
    if (protocol === 'file:') return;

    let _open: any = xhr.prototype.open;
    let host: string = (env === 'beta' ? 'http://parjna.51ping.com' : 'http://prajna.sankuai.com');

    xhr.prototype.open = function (method: string, url: string) {
        console.info(`XHR open at ${url}`);
        this.originUrl = url;
        this.originMethod = method;
        if (/catfront.(dianping|51ping).com/.test(url)) {
            console.info(`Hijacked xhr open at ${url}`);
            arguments[1] = `${host}/api/cat`;
        } else if (/report.meituan.com/.test(url)) {
            console.info(`Hijacked xhr open at ${url}`);
            arguments[1] = `${host}/api/lingxi`;
        }
        return _open.apply(this, arguments); // call owl's xhr.open
    };
};

function hijackSend(ctx: any): void {
    let _send: any = xhr.prototype.send;

    xhr.prototype.send = function () {
        let _this = this;
        _this.addEventListener('readystatechange', function () {
            switch (_this.readyState) {
                case 2: break;
                case 3: break;
                case 4:
                    if (_this.status >= 300) {
                        ctx.core.emit(LogLevel.ERROR);
                    }
                    break;
                default: break;
            };
        });

        return _send.apply(this, arguments); // call owl's xhr.send
    };
}

export { hijackOpen, hijackSend, hijackSendBeacon };
