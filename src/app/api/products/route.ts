import { cookies } from "next/headers"

export async function GET() {
    const access_token = cookies().get('salla_token')?.value;
    const res = await fetch('https://api.salla.dev/admin/v2/products?product=1503648251', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    })
    const data = await res.json()
    console.log('res from route', data);
    console.log('res from route');
    return Response.json({ data });
}