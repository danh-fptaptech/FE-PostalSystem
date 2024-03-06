import {NextResponse} from "next/server";
export async function POST(req: Request) {
    try {

        const newPackage = await req.json();
        const apilink = process.env.API_URL;
        const response = await fetch(`${apilink}/Package/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPackage),
        });
        const res = await response.text();
        return NextResponse.json({data: res});
    } catch (error) {
        console.log("Error:",error)
        return NextResponse.json({error: "api backend error"});
    }
}