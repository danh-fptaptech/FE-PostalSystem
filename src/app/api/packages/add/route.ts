import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const payload = await req.json();

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Package/add`, {
			method: req.method,
			headers: req.headers,
			body: JSON.stringify(payload),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to add package",
			});
		}

		console.log("Unhandled server-side error in add package");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to add package",
		});
	} catch (error) {
		console.log("Unhandled client-side error in add package", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to add package",
		});
	}
}
