import { Hono } from "hono";
import { handle } from 'hono/vercel';
import account from "./accounts";
import products from "./products";
import { createMiddleware } from "hono/factory";
import { cookies } from "next/headers";
export const runtime = "edge";



export type Env = {
    Variables: {
        access_token: string;
    };
};
const authUserMiddleware = createMiddleware<Env>(async (c, next) => {
    const access_token = cookies().get('salla_token')?.value;
    c.set("access_token", access_token ?? '');

    await next();
})

const app = new Hono<Env>().basePath('/api/v1');

app.use(authUserMiddleware);


app.get('/hello', (c) => {
    return c.json({ data: 'hiiiii' });
});

app.notFound((c) => {
    return c.text("Not Found API", 404);
});

app.route('/accounts', account);
app.route('/products', products);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export type AppType = typeof app;
