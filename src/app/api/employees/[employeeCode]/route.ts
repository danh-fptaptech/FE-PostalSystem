import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

// GET Employee by ID
export async function GET(
	req: Request,
	{ params }: { params: { employeeCode: string } }
) {
	try {
		const code = params.employeeCode;
		console.log(code);
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL + `/Employee/code/${code}`,
			{
				method: "GET",
				cache: "no-cache",
			}
		);

		let data = null;
		if (res.ok) {
			data = await res.json();
			console.log(data);
		}

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Get employee successfully",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Failed to get employee",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Failed to get employee",
		});
	}
}

export async function PUT(req: NextApiRequest) {
	const { employeeId } = req.query;
	const updatedEmployee = await req.body;
	updatedEmployee.avatar = "updatedAvatar";
	try {
		const response = await fetch(
			process.env.NEXT_PUBLIC_API_URL + `/Employee/${employeeId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedEmployee),
			}
		);

		const data = await response.json();

		if (response.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Update employee successfully",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Failed to update employee !",
		});
	} catch (error) {
		return console.log("Error update employee: ", error);
	}
}
