import Core from './core';
import { InitOption, Prajna } from './types/core.type';

let singleton: Core = null;
// let pageView = (target: any, key: string, descriptor: any) => {
//     return descriptor;
// };

function init(opts: InitOption): Core {
    if (!singleton) {
        singleton = new Core(opts);
        // pageView = singleton.pageView;
    }

    return singleton;
};


const Prajna: Prajna = {
    init: init,
    // pageView: pageView
};

export default Prajna;
