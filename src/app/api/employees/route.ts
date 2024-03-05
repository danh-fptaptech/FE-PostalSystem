import { NextResponse } from "next/server";

// GET ALL
export async function GET() {
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/Employee", {
			method: "GET",
			cache: "no-cache",
		});

		let data = null;
		if (res.ok) {
			data = await res.json();
			//console.log(data);
		}

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Get employees successfully.",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Fail to get employees.",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to get employees.",
		});
	}
}

// POST
export async function POST(req: Request) {
	const employee = await req.json();
	employee.avatar = "asssa";
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/Employee`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(employee),
		});

		console.log(employee);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add employee successfully.",
			});
		}

		const data = await res.json();

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to add employee.",
		});
	} catch (error) {
		console.log("Error add employee: ", error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops ! Error while trying to add employee.",
		});
	}
}
