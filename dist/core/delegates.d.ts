declare class Delegator {
    private proto;
    private target;
    private methods;
    private getters;
    private setters;
    private fluents;
    constructor(proto: any, target: any);
    method(name: string): Delegator;
    access(name: string): Delegator;
    getter(name: string): Delegator;
    setter(name: string): Delegator;
    fluent(name: string): Delegator;
}
export default Delegator;
