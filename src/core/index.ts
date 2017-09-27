import Core, { mixin } from './core';
import { InitOption, Whatever } from './types/core.types';

let singleton: Core = null;

function init(opts: InitOption): Core {
    if (!singleton) {
        singleton = new Core(opts);
    }

    return singleton;
};

const Whatever: Whatever = { init };

export default Whatever;
export { mixin };
