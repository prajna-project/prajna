const match = (name: string, ignore: any) => {
    if (ignore) {
        for (let i: number = 0; i < ignore.length; i++) {
            if (typeof ignore[i] === 'object' && ignore[i].test(name) === true) {
                return true;
            } else if (name.indexOf(ignore[i]) > -1) {
                return true;
            }
        }
    }
    return false;
};
export { match };
