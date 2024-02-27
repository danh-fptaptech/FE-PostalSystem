import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
	req: NextRequest,
	{
		params,
	}: {
		params: { roleId: number; permissionName: string };
	}
) {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				"/Role/" +
				params.roleId +
				"/Permission/" +
				params.permissionName,
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
