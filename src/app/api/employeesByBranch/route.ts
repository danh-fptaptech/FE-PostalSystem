import { NextRequest, NextResponse } from "next/server";

// GET ALL
export async function GET(
	req: NextRequest,
	{ params }: { params: { branchName: string } }
) {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL + `/Employee/${params.branchName}`,
			{
				method: "GET",
				cache: "no-cache",
			}
		);

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
