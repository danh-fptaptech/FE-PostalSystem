"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";
import EmployeeInfoPage from "./[employeeCode]/EmployeeInfo";
import ChangePasswordPage from "./[employeeCode]/ChangePassword";
import HistoryLogsPage from "./[employeeCode]/HistoryLogs";

export default function EmployeeInfo() {
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
						label="Informations"
					/>
					<Tab
						value={1}
						label="Change Password"
					/>
					<Tab
						value={2}
						label="History Logs"
					/>
				</Tabs>
				{value === 0 && <EmployeeInfoPage />}
				{value === 1 && <ChangePasswordPage />}
				{value === 2 && <HistoryLogsPage />}
			</Box>
		</>
	);
}
