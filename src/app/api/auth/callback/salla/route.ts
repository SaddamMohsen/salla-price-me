"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { createUser, db, insertAccount } from "@/db/drizzle";
import { accounts, users } from "@/db/schema";
import { ACCOUNTS } from "@/constants/types";
export async function GET(req: NextApiRequest, res: NextApiResponse) {

    try {
        let code = "";
        let state = '';
        const url = req.url;
        const codeMatch = url?.match(/code=([^&]+)/);
        const stateMatch = url?.match(/state=([^&]+)/) ?? '';

        if (codeMatch) {
            const extractedCode = codeMatch[1];
            const stateMatched = stateMatch[1];
            code = extractedCode;
            state = stateMatched;
            // console.log(`Extracted code: ${extractedCode}`);
            // console.log(`Extracted state: ${stateMatched}`);
        } else {
            console.log("Code not found in the string.");
        }

        const postData = {
            grant_type: 'authorization_code',
            redirect_uri: "http://localhost:3000/api/auth/callback/salla",
            code: code,
            client_id: process.env.AUTH_CLIENT_ID ?? '',
            client_secret: process.env.AUTH_CLIENT_SECRET ?? '',
            state: state,
        }

        const tokenResponse = await fetch(
            `https://accounts.salla.sa/oauth2/token`,
            {
                method: "POST",
                body: new URLSearchParams(postData),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
        const response = await tokenResponse.json();

        const { access_token, expires_in, refresh_token } = response;
        const expireDate = new Date(expires_in * 1000)

        const authcookie = cookies();
        authcookie.set('salla_token', access_token, { path: '/' });
        const userProfileResponse = await fetch(
            "https://accounts.salla.sa/oauth2/user/info",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        const userProfile = await userProfileResponse.json();
        console.log(userProfile);
        if (userProfile.data) {
            try {
                // const { id, name, email, mobile, role, created_at, context, merchant }
                //   : { id: number, name: string, email: string, mobile: string, role: string, created_at: string, context: any, merchant: any } = userProfile.data;
                // console.log(id, name, email, context.exp);
                await createUser(userProfile.data).then(async () => {
                    await insertAccount({
                        access_token: access_token,
                        expiredIn: userProfile.data.context.exp,
                        refresh_token: refresh_token,
                        user_id: userProfile.data.id
                    });

                });

                // console.log('in route ', returning);
            } catch (error: any) {
                console.log('error in insert route', error);
                //throw error;
            }

        }

        return Response.json({ data: "success" });


    } catch (error) {
        console.error("error in callback route", error);
        throw Response.error();
    }
}