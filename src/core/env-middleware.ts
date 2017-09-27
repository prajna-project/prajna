const Global: Window = window;
const Nav: Navigator = Global.navigator;

function envMiddleware(ctx: any, next: any): any {
    console.log(Nav.userAgent);
    return;
}

export default envMiddleware;
