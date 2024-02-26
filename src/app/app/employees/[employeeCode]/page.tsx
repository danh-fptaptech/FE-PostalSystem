"use client";

import { Employee } from "@/libs/data";
import { EmployeeProps } from "@/types/types";
import React from "react";

function EmployeeInfo({ params }: EmployeeProps) {
	const [employee, setEmployee] = React.useState<Employee>();
	const [isLoading, setIsLoading] = React.useState(true);
	React.useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`/api/employees/${params.employeeCode}`);
			const data = await response.json();

			if (response.ok) {
				setEmployee(data.data);
				setIsLoading(false);
			} else {
				console.error("Failed to get employee !");
			}
		};
		fetchData();
	}, [params.employeeCode]);
	return (
		<div>
			{!isLoading ? (
				<div>
					<p>{employee?.employeeCode}</p>
					<p>{employee?.employeeCode}</p>
					<p>{employee?.employeeCode}</p>
				</div>
			) : (
				<p>NO DATA !!!</p>
			)}
		</div>
	);
}

export default EmployeeInfo;
