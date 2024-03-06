"use client";

import { Tabs, Tab, Box } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";
import EmployeeManagement from "./employees/page";
import UpdatedRequestManagement from "./requests/page";
import RoleManagement from "./roles/page";

export default function Page() {
	const [value, setValue] = React.useState(0);
	const { data: session } = useSession();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<>
			<Box
				alignItems="center"
				sx={{
					maxWidth: { xs: 320, sm: 480, lg: 1024 },
					bgcolor: "background.paper",
				}}>
				<Tabs
					value={value}
					onChange={handleChange}
					variant="scrollable"
					scrollButtons="auto">
					<Tab
						value={0}
						label="Employee Management"
					/>
					<Tab
						value={1}
						label="Updated Requests"
					/>
					<Tab
						value={2}
						label="Role Management"
					/>
				</Tabs>
				{/* {value === 0 && <EmployeeManagement />}
				{value === 1 && <UpdatedRequestManagement />}
				{value === 2 && <RoleManagement />} */}
			</Box>
		</>
	);
}
