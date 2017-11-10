import Core from './core';
import {
    InitOption,
    Prajna
} from './types/core.type';

let singleton: Core = null;

function init(opts: InitOption): Core {
    if (!singleton) {
        singleton = new Core(opts);
    }

    return singleton;
};


const Prajna: Prajna = { init };

export default Prajna;
