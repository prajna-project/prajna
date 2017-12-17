import GLOBAL from '../util/global';
import Core from './core';
import { InitOption, Prajna } from './types/core.type';

let singleton: Core = null;

function init(opts: InitOption): Core {
    if (!singleton) {
        singleton = new Core(opts);
    }

    return singleton;
}

!((win) => {
    win.Prajna = { init };
})(GLOBAL);
