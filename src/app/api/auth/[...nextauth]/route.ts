import { handlers } from "auth"; // Referring to the auth.ts we just created
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { cookies } from "next/headers";
export const { GET, POST } = handlers;
