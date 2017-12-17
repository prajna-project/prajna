function postXHR(options: any) {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open('POST', options.url, true);
    let headers: any = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    if (options.headers) {
        headers = options.headers;
    }
    Object.keys(headers).forEach((name) => {
        xhr.setRequestHeader(name, headers[name]);
    });
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (options.success) {
                    options.success();
                }
            } else { // report fail
                if (options.failure) {
                    options.failure();
                }
            }
        }
    };
    xhr.onerror = (e) => {
        if (options.error) {
            options.error(e);
        }
    };
    xhr.send(options.data);
}

export default postXHR;
