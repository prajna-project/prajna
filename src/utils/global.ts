const global: any = window;

export function getGlobal(prop: string): any {
    return global[prop];
}

export function setGlobal(prop: string, value: any): void {
    global[prop] = value;
}
