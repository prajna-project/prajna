import Core from './core';
import { InitOption } from './types/core.type';

let GLOBAL: any = window;
let singleton: Core = null;

function init(opts: InitOption): Core {
    if (!singleton) {
        singleton = new Core(opts);
    }

    return singleton;
};

export { init };
