import { NextResponse } from "next/server";

export async function GET() {
	const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/Permission", {
		method: "GET",
		cache: "no-cache",
	});

	const data = await res.json();

	if (res.ok) {
		return NextResponse.json({
			ok: true,
			status: "success",
			message: "Get permissions successfully",
			data,
		});
	}

	return NextResponse.json({
		ok: false,
		status: "Server error",
		message: "Fail to get permissions",
	});
}
