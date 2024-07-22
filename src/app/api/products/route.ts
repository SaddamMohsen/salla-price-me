import { cookies } from "next/headers"

export async function GET() {
    const access_token = cookies().get('salla_token')?.value;
    const res = await fetch('https://api.salla.dev/admin/v2/products', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    })
    const data = await res.json()
    console.log(data);
    return Response.json({ data });
}