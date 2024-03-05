import { NextResponse } from "next/server";

// export async function GET(req: Request) {
// 	try {
// 		const response = await fetch("http://localhost:5255/api/Branch/all", {
// 			cache: "no-store",
// 		});
// 		const data = await response.json();
// 		return NextResponse.json({ branchs: data });
// 	} catch (error) {
// 		return NextResponse.json({ error: "api backend error" });
// 	}
// }

export async function GET() {
	const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/Branch/All", {
		method: "GET",
		next: {
			revalidate: 1,
		},
	});

	const data = await res.json();

	if (res.ok) {
		return NextResponse.json({
			ok: true,
			status: "success",
			message: "Get employees successfully",
			data,
		});
	}

	return NextResponse.json({
		ok: false,
		status: "server error",
		message: "Fail to get employees",
	});
}
