export const params:Map<string, string> = new Map<string, string>(
    window.location.search.slice(1).split('&')
        .map((seg):[string, string] => {
            const pair = seg.split('=').map(decodeURIComponent);
            return [pair[0], pair[1]];
        })
);