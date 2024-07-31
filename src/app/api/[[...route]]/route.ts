import { Hono } from "hono";
import { handle } from 'hono/vercel';
import account from "./accounts";
export const runtime = "edge";

const app = new Hono().basePath('/api');




app.get('/hello', (c) => {
    return c.json({ data: 'hiiiii' });
});

app.notFound((c) => {
    return c.text("Not Found API", 404);
});

app.route('/accounts', account);
export const GET = handle(app);
export const POST = handle(app);
//export default app;
export type AppType = typeof app;
