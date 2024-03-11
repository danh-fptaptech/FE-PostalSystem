"use client";
import Tabs from "@mui/material/Tabs";
import UserLoginForm from "./UserLoginForm";
import Tab from "@mui/material/Tab";
import React from "react";
import { useSession } from "next-auth/react";

export default function LoginPage() {
	const [value, setValue] = React.useState(0);
	const { data: session } = useSession();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<Tabs
				value={value}
				onChange={handleChange}
				centered
			>
				<Tab label="User" />
			</Tabs>

			{value === 0 && <UserLoginForm />}
		</>
	);
}
