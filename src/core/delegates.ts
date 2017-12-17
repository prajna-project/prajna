class Delegator {
    private proto: any;
    private target: any;
    private methods: string[] = [];
    private getters: string[] = [];
    private setters: string[] = [];
    private fluents: string[] = [];

    constructor(proto: any, target: any) {
        this.proto = proto;
        this.target = target;
    }

    public method(name: string): Delegator {
        const proto: any = this.proto;
        const target: any = this.target;
        this.methods.push(name);

        proto[name] = function() {
            return this[target][name].apply(this[target], arguments);
        };
        return this;
    }

    public access(name: string): Delegator {
        return this.getter(name).setter(name);
    }

    public getter(name: string): Delegator {
        const proto: any = this.proto;
        const target: any = this.target;
        this.getters.push(name);

        Object.defineProperty(proto, name, {
            get() {
                return this[target][name];
            },
            enumerable: true,
            configurable: true,
        });

        return this;
    }

    public setter(name: string): Delegator {
        const proto: any = this.proto;
        const target: any = this.target;
        this.setters.push(name);

        Object.defineProperty(proto, name, {
            set(val: any) {
                return this[target][name] = val;
            },
            enumerable: true,
            configurable: true,
        });

        return this;
    }

    public fluent(name: string): Delegator {
        const proto: any = this.proto;
        const target: any = this.target;
        this.fluents.push(name);

        proto[name] = function(val: any) {
            if ('undefined' !== typeof val) {
                this[target][name] = val;
                return this;
            } else {
                return this[target][name];
            }
        };

        return this;
    }
}

export default Delegator;
