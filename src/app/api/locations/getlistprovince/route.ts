import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const data = [
            {
                id: 1,
                locationName: "Hà Nội",
                postalCode: "100000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 2,
                locationName: "Hồ Chí Minh",
                postalCode: "700000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 3,
                locationName: "Đà Nẵng",
                postalCode: "550000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 4,
                locationName: "Hải Phòng",
                postalCode: "180000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 5,
                locationName: "Cần Thơ",
                postalCode: "900000",
                locationLevel: 0,
                locationOf: 0,
            },
            {
                id: 6,
                locationName: "An Giang",
                postalCode: "880000",
                locationLevel: 0,
                locationOf: 0,
            },
        ];
        return NextResponse.json({ provinces: data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}