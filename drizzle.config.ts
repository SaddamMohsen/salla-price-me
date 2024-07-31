"use server";
import { defineConfig } from 'drizzle-kit'
import { config } from "dotenv";

config({ path: '.env.local' });
export default defineConfig({
    dialect: "postgresql", // "postgresql" | "mysql"
    schema: "./db/schema.ts",
    out: "./drizzle",
    driver: "aws-data-api", // optional and used only if `aws-data-api`, `turso`, `d1-http`(WIP) or `expo` are used
    // dbCredentials: {

    //     //url: process.env.DATABASE_URL!,
    //     //host:"",
    //     // database:"",
    //     // user:"",
    //     // password:"",
    //     // ssl:"require",
    // },
    verbose: true,
    strict: true,
})