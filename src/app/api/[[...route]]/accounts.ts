import { Hono } from "hono";
import { ACCOUNTS } from "@/constants/types";
import { zValidator } from "@hono/zod-validator";
import { db } from '@/db/drizzle';
import { accounts } from "@/db/schema";
const app = new Hono()
    .get('/', async (c) => {
        console.log('in get account');
        const res = await db.select().from(accounts);
        console.log('res from account', res);
        return c.json({ account: res });
    })
// .post('/', zValidator("json", ACCOUNTS, (result, c) => {
//     if (!result.success) {
//         console.log("invalid");
//         return c.text("Invalid Values!", 400);
//     }
// }), (c) => {
//     type NewAccount = typeof accounts.$inferInsert;
//     const account: NewAccount = c.req.valid("json");
//     console.log(account);
//     const data = db.insert(accounts).values(account).returning();
//     return c.json({
//         newAccount: data
//     })

// });

export default app;