"use client";

import React from "react";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
	user,
	employees,
	admin,
	children,
}: {
	user: React.ReactNode;
	employees: React.ReactNode;
	admin: React.ReactNode;
	children: React.ReactNode;
}) {
	const { data: session, status } = useSession();

	if (status === "authenticated") {
		if (session?.user.role.name === "User") {
			return <div>{user}</div>;
		}
		if (session?.user.role.name === "Employee") {
			return <div>{employees}</div>;
		}
		if (session?.user.role.name === "Admin") {
			return <div>{admin}</div>;
		}
	}

	return <div>{null}</div>;
}
