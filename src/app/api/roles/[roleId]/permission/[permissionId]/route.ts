import { NextRequest, NextResponse } from "next/server";

export async function POST(
	req: NextRequest,
	{
		params,
	}: {
		params: { roleId: number; permissionId: number };
	}
) {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				"/Role/" +
				params.roleId +
				"/Permission/" +
				params.permissionId,
			{
				method: "POST",
				cache: "no-cache",
			}
		);

		let data = null;

		if (res.ok) {
			data = await res.json();
		}

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add permission successfully",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Failed to add! The permission has already existed.",
		});
	} catch (error) {
		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Failed to add permission into role !",
		});
	}
}

// export async function POST(
// 	req: NextRequest,
// 	{
// 		params,
// 	}: {
// 		params: { roleId: number; permissionIds: number[] };
// 	}
// ) {
// 	try {
// 		const permissionIdPromises = params.permissionIds.map(
// 			async permissionId => {
// 				const res = await fetch(
// 					process.env.NEXT_PUBLIC_API_URL +
// 						"/Role/" +
// 						params.roleId +
// 						"/Permission/" +
// 						permissionId,
// 					{
// 						method: "POST",
// 						cache: "no-cache",
// 					}
// 				);

// 				if (res.ok) {
// 					return res.json();
// 				} else {
// 					// Handle error or failed request
// 					throw new Error("Failed to add permission with ID: " + permissionId);
// 				}
// 			}
// 		);

// 		const permissionResults = await Promise.all(permissionIdPromises);

// 		// Check if all requests were successful
// 		const allRequestsSuccessful = permissionResults.every(result => result.ok);

// 		if (allRequestsSuccessful) {
// 			return NextResponse.json({
// 				ok: true,
// 				status: "success",
// 				message: "Add permissions successfully",
// 				data: permissionResults.map(result => result.data),
// 			});
// 		} else {
// 			// Handle case when at least one request failed
// 			return NextResponse.json({
// 				ok: false,
// 				status: "error",
// 				message: "Failed to add permissions",
// 			});
// 		}
// 	} catch (error) {
// 		return console.log("Error adding permissions: ", error);
// 	}
// }

export async function DELETE(
	req: NextRequest,
	{
		params,
	}: {
		params: { roleId: number; permissionId: number };
	}
) {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				"/Role/" +
				params.roleId +
				"/Permission/" +
				params.permissionId,
			{
				method: "DELETE",
				cache: "no-cache",
			}
		);
		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Delete permission to role successfully",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to delete permissions",
		});
	} catch (error) {
		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to delete permissions",
		});
	}
}
