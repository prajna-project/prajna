import Core from '../core';

export interface InitOption {
    fallback?: boolean,
}

export interface Whatever {
    init: (opt: InitOption) => Core
}
