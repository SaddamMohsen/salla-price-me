

import { serial, text, timestamp, pgTable, numeric, integer, date, } from "drizzle-orm/pg-core";

export const accounts = pgTable('accounts', {
    id: serial("id").primaryKey(),
    access_token: text("access_token"),
    expiredIn: integer('expired_in'),//timestamp('expired_in', { mode: "string" }),
    refresh_token: text("refresh_token"),
    user_id: integer("user_id").references(() => users.id),
});
export const users = pgTable("users", {

    id: integer("id").primaryKey().notNull().unique(),
    name: text("name"),
    email: text("email"),
    mobile: text("mobile"),
    role: text("role"),    //.$type<"admin" | "user">(),
    createdAt: text("created_at"),
    updatedAt: text("updated_at"),

});

export const merchants = pgTable("merchants", {
    id: integer("id").primaryKey(),//1500169364,
    username: text("username"),
    name: text('name'),// 'متجر تجريبي',
    avatar: text('avatar'), //'https://salla-dev.s3.eu-central-1.amazonaws.com/logo/logo-fashion.jpg',
    store_location: text('location'),
    plan: text('plan'),//'pro',
    status: text('status'),//'active',
    domain: text('domain'), // 'https://salla.sa/dev-fhopssdfrv7rpkp9',
    tax_number: integer('tax_number'),
    commercial_number: integer('commercial_number'),// null,
    created_at: text('created_at'), // '2024-07-11 23:31:34',
    owner: integer('owner').references(() => users.id)
});

// data: {
//     id: 865761038,
//     name: 'Demo',
//     email: 'fhopssdfrv7rpkp9@email.partners',
//     mobile: '+966500000000',
//     role: 'user',
//     created_at: '2024-07-11 23:31:35',
//     merchant: {
//       id: 1500169364,
//       username: 'dev-fhopssdfrv7rpkp9',
//       name: 'متجر تجريبي',
//       avatar: 'https://salla-dev.s3.eu-central-1.amazonaws.com/logo/logo-fashion.jpg',
//       store_location: null,
//       plan: 'pro',
//       status: 'active',
//       domain: 'https://salla.sa/dev-fhopssdfrv7rpkp9',
//       tax_number: null,
//       commercial_number: null,
//       created_at: '2024-07-11 23:31:34'
//     },