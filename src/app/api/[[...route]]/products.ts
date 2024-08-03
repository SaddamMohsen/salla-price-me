import { Hono } from "hono";

import { ApiProductResponse } from "@/constants/types";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { Env } from "./route";

const app = new Hono<Env>()
    .get("/", async (c) => {
        const res = await fetch(
            "https://api.salla.dev/admin/v2/products", //'https://api.salla.dev/admin/v2/products/1051932301/variants',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${c.var.access_token}`,
                },
            }
        );
        const data: ApiProductResponse = await res.json();
        //const data = await res.json();
        console.log(data);
        console.log("in hono");
        return c.json({ products: data });
    })
    .get(
        "/:id",
        zValidator(
            "param",
            z.object({
                id: z.number(),
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param");

            const res = await fetch(
                `https://api.salla.dev/admin/v2/products/${id}`, //'https://api.salla.dev/admin/v2/products/1051932301/variants',
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${c.var.access_token}`,
                    },
                }
            );
            const data: ApiProductResponse = await res.json();
            //const data = await res.json();
            console.log(data);
            console.log("in hono");
            return c.json({ products: data });
        }
    )
    .post(
        "/",
        // zValidator(
        //     "param",
        //     z.object({
        //         "id": z.number(),

        //     }), (result, c) => {
        //         if (!result.success) {
        //             console.log("invalid");
        //             return c.text("Invalid Values!", 400);
        //         }
        //     }
        //),
        zValidator(
            "json",
            z.object({
                id: z.number(),
                nPrice: z.number(),
            }),
            (result, c) => {
                if (!result.success) {
                    console.log("invalid");
                    return c.text("Invalid Values!", 400);
                }
            }
        ),
        async (c) => {
            console.log("inside put products");
            const { id, nPrice } = c.req.valid("json");
            //const { id } = c.req.valid("param");
            const res = await fetch(
                `https://api.salla.dev/admin/v2/products/${id}`, //'https://api.salla.dev/admin/v2/products/1051932301/variants',
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${c.var.access_token}`,
                    },
                }
            );
            let { data } = await res.json();
            console.log("old price", data.price.amount, data.weight);
            let price = nPrice * data.weight;
            // console.log("new price", price);
            // const payload = {
            //     amount: price,
            //     currency: data.price.currency
            // };
            // console.log(JSON.stringify(payload));
            const resp = await fetch(
                `https://api.salla.dev/admin/v2/products/${id}`, //'https://api.salla.dev/admin/v2/products/1051932301/variants',
                {
                    body: JSON.stringify({
                        price: price,
                    }),
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${c.var.access_token}`,
                    },
                }
            );
            const nData = await resp.json();
            console.log("response from put product", nData);
            return c.json({ data: nData });
        }
    );

export default app;
