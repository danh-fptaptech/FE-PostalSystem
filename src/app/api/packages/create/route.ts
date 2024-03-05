import {NextResponse} from "next/server";
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const apilink = process.env.API_URL;
        const response = await fetch(`${apilink}/Package/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const res = await response.text();
        console.log("Data:", typeof res, res);
        return NextResponse.json({data: res});
    } catch (error) {
        console.log("Error:",error)
        return NextResponse.json({error: "api backend error"});
    }
}