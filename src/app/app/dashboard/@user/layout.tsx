"use client";

import Stack from "@mui/material/Stack";
import { UserContext } from "@/contexts/UserContext";
import React from "react";

export default function Layout({
	children,
	content,
}: {
	children: React.ReactNode;
	content: React.ReactNode;
}) {
	const [selectedTab, setSelectedTab] = React.useState("tab1");

	return (
		<UserContext.Provider value={{ selectedTab, setSelectedTab }}>
			<Stack
				direction="row"
				spacing={2}
			>
				{children}
				{content}
			</Stack>
		</UserContext.Provider>
	);
}
