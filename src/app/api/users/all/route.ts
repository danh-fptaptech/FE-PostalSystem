import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Users/All`, {
			// header must have access token
			headers: {
				...req.headers,
			},
			method: req.method,
		});

		const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to get users with all",
				data,
			});
		}

		if (res.status === 401) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.message,
			});
		}

		if (res.status === 404) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.message,
			});
		}

		console.log("Unhandled server-side error in get users with all");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in get users with all", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get users with all",
		});
	}
}
