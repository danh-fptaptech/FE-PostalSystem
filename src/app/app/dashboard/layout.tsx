"use client";

import React from "react";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
	users,
	employees,
}: {
	users: React.ReactNode;
	employees: React.ReactNode;
}) {
	const { data: session, status, update } = useSession();

	if (status !== "authenticated") {
		return <div>unauuthenticated</div>;
	}

	if (session.user.role) {
		if (session?.user.role.name === "User") {
			return <div>{users}</div>;
		}
		if (session?.user.role.name === "Employee") {
			return <div>{employees}</div>;
		}
	}

	return null;
}
