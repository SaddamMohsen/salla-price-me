
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as z from "zod";
import { Merchant } from "@/constants/types";
import { accounts, merchants, products, users } from './schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';


const sql = neon(process.env.DATABASE_URL!);
console.log(process.env.DATABASE_URL)
export const db = drizzle(sql);

export const insertAccount = async (data: any) => {
    try {
        const { user_id, access_token, expiredIn, refresh_token } = data;
        const result = await db.select({ userId: user_id, exp: expiredIn })
            .from(accounts).where(eq(accounts.user_id, user_id))


        if (result.length > 0) {
            console.log(result[0]);
            const { userId, exp } = result[0];
            if (exp > Date.now()) {
                ///TODO : add a way to refresh token
            }
            return;
            // return { status: 200, message: "Account already exists and valid" }

        }

        const res = await db.insert(accounts).values({
            access_token: access_token, expiredIn: expiredIn, refresh_token: refresh_token, user_id: user_id
        }).returning();
        console.log('return from insert db', res);
        return res;
    } catch (error: any) {
        console.log('error in insert into database', error);
        throw error;

    }


}

export const createUser = async (data: any) => {
    try {
        const { id, name, email, mobile, role, created_at, context, merchant } = data;
        //:{ id:number, name:string, email:string, mobile:string, role:string, created_at:string, context:any,merchant:any}
        const result = await db.select({ userId: id }).from(users).where(eq(users.id, id))


        if (result.length > 0) {

            const { userId } = result[0];
            //return { success: "user already exist" };

        }

        const res = await db.insert(users).values({
            id: id,
            name: name,
            email: email,
            mobile: mobile,
            role: role,
            createdAt: created_at,
        }).then(async (res) => {
            console.log('return from insert user to db', res);
            await createMerchant(merchant, id);
        }).catch((error) => {
            console.log('error in insert user to db', error);
            throw error('error in insert user to db')
        })



    } catch (error: any) {
        console.log('error in insert user into database', error);
        throw error;

    }
}

export const createMerchant = async (data: z.infer<typeof Merchant>, owner: number) => {
    console.log('inside create merchant');
    // const validateValues = Merchant.safeParse(data)
    // if (!validateValues.success) {
    //     console.log('invalid values', validateValues.error);
    //     return { error: "Invalid merchants fields!" };
    // }

    const { id, username, name,
        avatar, store_location, plan,
        status, domain, tax_number, commercial_number, created_at } = data;//validateValues.data;
    console.log('insert new merchants');
    const resMer = await db.insert(merchants).values({
        id: id,
        name: name,
        username: username,
        avatar: avatar,
        store_location: store_location,
        plan: plan,
        status: status,
        domain: domain,
        tax_number: tax_number,
        commercial_number: commercial_number,
        created_at: created_at,
        owner: owner
    }).returning();
    console.log('return from insert merchant db', resMer);
    //return { status: 200, success: "success insert into merchant" }
}


export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);