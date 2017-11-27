const match = function (name: string, ignore: any) {
    if (ignore) {
        for (let i: number = 0; i < ignore.length; i++) {
            if (ignore[i].test(name) === true) { return true; }
        }
    }
    return false;
};
export { match };
