function compose(middleware: any[]): (ctx: any, next?: any) => any {
    return (context: any, next: any) => {
        let index = -1;

        return dispatch(0);

        function dispatch(i: number): Promise<any> {
            if (i <= index) {
                return Promise.reject(new Error("next() called multiple times"));
            }

            index = i;
            let lambda = middleware[i];

            if (i === middleware.length) { // last one
                lambda = next;
            }

            if (!lambda) {
                return Promise.resolve(); // end
            }

            try {
                return Promise.resolve(lambda(context, () => {
                    return dispatch(i + 1);
                }));
            } catch (err) {
                return Promise.reject(err);
            }
        }
    };
}

export default compose;
