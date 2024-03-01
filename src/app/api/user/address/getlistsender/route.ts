import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const data = [
            {
                value: '1',
                label: 'Nguyễn Hồng Danh, 0123456789, 123 Nguyễn Chí Thanh, Hà Nội'
            },
            {
                value: '2',
                label: 'Người gửi 2'
            },
            {
                value: '3',
                label: 'Người gửi 3'
            },
            {
                value: '4',
                label: 'Nguoi gui 4'
            }
        ]
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}