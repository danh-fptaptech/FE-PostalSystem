"use client";

import { Employee, fetchEmployees } from "@/libs/data";
import Link from "next/link";
import React from "react";

export default function EmployeeList() {
	const [employees, setEmployees] = React.useState<Employee[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	React.useEffect(() => {
		Promise.all([fetchEmployees()]).then(data => {
			const [employeesRes] = data;
			if (employeesRes.ok) {
				setEmployees(employeesRes.data);
			}

			setIsLoading(false);
		});
	}, []);
	return (
		<div>
			{employees.map(employee => (
				<button
					key={employee.id}
					className="mr-2 btn btn-success">
					<Link href={`employees/${employee.employeeCode}`}>
						{employee.employeeCode}
					</Link>
				</button>
			))}
		</div>
	);
}
