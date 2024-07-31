import * as z from "zod";


export const ACCOUNTS = z.object({
    id: z.number(),
    access_token: z.string(),
    expiredIn: z.number(),
    refresh_token: z.string(),
    user_id: z.number()
});

export const USERS = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    mobile: z.string(),
    password: z.optional(z.string()),
    role: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
})

export const Merchant = z.object({
    id: z.number(),

    username: z.optional(z.string()),
    name: z.optional(z.string()),
    avatar: z.optional(z.string()),
    store_location: z.optional(z.string()),
    plan: z.optional(z.string()),
    status: z.optional(z.string()),
    domain: z.string(),
    tax_number: z.optional(z.number()),
    commercial_number: z.optional(z.number()),
    created_at: z.optional(z.string()),
})
