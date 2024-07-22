import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    console.log("in auth callback route GET");
    //console.log(req);
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
            console.log(`Extracted code: ${extractedCode}`);
            console.log(`Extracted state: ${stateMatched}`);
        } else {
            console.log("Code not found in the string.");
        }

        // const { code } = req.query;
        console.log("code in callback", code);
        // `grant_type=authorization_code&redirect_uri=http://localhost:3000/api/auth/callback/salla&code=${code}&
        //   client_id=${process.env.AUTH_CLIENT_ID}&client_secret=${process.env.AUTH_CLIENT_SECRET}`
        const postData = {
            grant_type: 'authorization_code',
            redirect_uri: "http://localhost:3000/api/auth/callback/salla",
            code: code,
            client_id: "24d97f44-d31b-4469-88ee-3658b86965a9",// process.env.AUTH_CLIENT_ID??'',
            client_secret: "6d6454621d3a27ec02b6828faf062a51",// process.env.AUTH_CLIENT_SECRET??'',
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
        console.log("res", response);
        const { access_token, expires_in, refresh_token } = response;
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

        return Response.redirect('http://localhost:3000');
        //return Response.json({ data: { access_token, expires_in, refresh_token } });

    } catch (error) {
        console.error("error", error);
        return Response.error();
    }
}