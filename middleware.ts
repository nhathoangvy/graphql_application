export async function Middleware(ctx: any, next:any) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
    console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
}