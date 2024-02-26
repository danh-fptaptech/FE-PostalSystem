import { NextResponse } from "next/server";

export async function GET() {
	const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/Role", {
		method: "GET",
		cache: "no-cache",
	});

	const data = await res.json();

	if (res.ok) {
		return NextResponse.json({
			ok: true,
			status: "success",
			message: "Get roles successfully",
			data,
		});
	}

	return NextResponse.json({
		ok: false,
		status: "server error",
		message: "Fail to get roles",
	});
}
// POST
export async function POST(req: Request) {
	const role = await req.json();
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/Role`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(role),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add role successfully",
			});
		}
		const data = await res.json();
		console.log(data);

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Failed to add role ! The role has already existed.",
		});
	} catch (error) {
		return console.log("Error add role: ", error);
	}
}
