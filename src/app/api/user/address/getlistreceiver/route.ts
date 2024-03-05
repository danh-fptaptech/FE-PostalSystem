import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const data:any = [

        ]
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}