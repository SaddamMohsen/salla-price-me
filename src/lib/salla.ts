import { OAuthConfig } from 'next-auth/providers/oauth';

import { OAuthProviderOptions } from './oauth-provider';


const callbackUrl = "http://localhost:3000/api/auth/callback/salla";

const SallaProvider = (options: OAuthProviderOptions): OAuthConfig<any> => ({
    ...{
        id: "salla",
        name: "Salla",
        type: "oauth",
        version: "2.0",
        redirectProxyUrl: "http://localhost:3000/api/auth/callback/salla",
        // redirectProxyUrl: callbackUrl,
        //type: "oidc",
        checks: ["state"],
        authorization:
        {
            url: "https://accounts.salla.sa/oauth2/auth",
            params: {
                grant_type: "authorization_code",
                response_type: "code",
                scope: "offline_access",
                client_id: process.env.AUTH_CLIENT_ID,
                client_secret: process.env.AUTH_CLIENT_SECRET,
                redirect_uri: "http://localhost:3000/api/auth/callback/salla",
            },
        },
        token: {
            //url: `https://accounts.salla.sa/oauth2/token`,
            // params: {
            //     grant_type: "authorization_code",
            //     scope: "offline_access",
            //     client_id: process.env.AUTH_CLIENT_ID,
            //     client_secret: process.env.AUTH_CLIENT_SECRET,
            //     redirect_uri: "http://localhost:3000/api/auth/callback/salla",
            //     token_endpoint_auth_method: 'client_secret_post',

            // }
            async request(context) {
                try {
                    console.log('in auth get token', context.params);
                    const { code } = context.params;
                    const { state } = context.params;

                    const postData = {
                        grant_type: 'authorization_code',
                        redirect_uri: "http://localhost:3000/api/auth/callback/salla",
                        scope: "offline_access",
                        code: code,
                        client_id: process.env.AUTH_CLIENT_ID,
                        client_secret: process.env.AUTH_CLIENT_SECRET,
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
                    const result = await tokenResponse.json();
                    console.log('result in get token', result)
                    //         const { access_token, expires_in, refresh_token } = response;
                    const tokens = {

                        access_token: result.access_token,
                        refresh_token: result.refresh_token,
                        expires_at: result.expires_in,
                        token_type: result.token_type,
                        scope: result.scope,
                    };

                    return { tokens };
                } catch (error) {
                    console.log('error in token endpoinst', error);
                }

            }
        },
        // userinfo: "https://accounts.salla.sa/oauth2/user/info",
        userinfo: {
            // url: "https://accounts.salla.sa/oauth2/user/info",
            async request(context: { tokens: { access_token: any; expires_at: any; refresh_token: any; }; }) {
                try {
                    const { access_token, expires_at, refresh_token } = context.tokens;

                    console.log('access_token', access_token);

                    const res = await fetch(
                        "https://accounts.salla.sa/oauth2/user/info",
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                        }
                    );
                    const { data: user } = await res.json()
                    return user;
                } catch (error) {
                    console.log("error in user profile", error);
                }
            }
        },
        profile: async (profile, tokens) => {
            console.log('profile in profile', profile);
            //  console.log('token in profile', tokens);
            // const res = await fetch(
            //     "https://accounts.salla.sa/oauth2/user/info",
            //     {
            //         method: "GET",
            //         headers: {
            //             Authorization: `Bearer ${tokens.access_token}`,
            //         },
            //     }
            // );
            // const { data: user } = await res.json();
            // console.log('User info', user);
            const user = profile;
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                mobile: user.mobile,
                merchant: user.merchant,
            };
        },



    },
    ...options,
});

export default SallaProvider;