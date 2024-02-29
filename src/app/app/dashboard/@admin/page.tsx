import React from "react";

export default function Page() {
	return (
		<div>
			<h1>Admin page</h1>
			<a href="/app/dashboard/employees">Employees</a>
			<a href="/app/dashboard/requests">Requests</a>
			<a href="/app/dashboard/roles">Roles</a>
		</div>
	);
}
