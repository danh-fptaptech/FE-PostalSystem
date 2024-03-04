"use client";

import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/app/components/Loading";
import {
	fetchEmployees,
	fetchBranches,
	fetchRolesWithPermission,
	fetchLocations,
	fetchChangeStatus,
} from "@/app/_data/index";
import {
	Box,
	Button,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
} from "@mui/material";
import { DriveFileRenameOutline } from "@mui/icons-material";
import {
	ApiResponse,
	Employee,
	Branch,
	Role,
	Location,
	CreateEmployeeRequest,
	UpdateEmployeeRequest,
} from "@/types/types";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function EmployeeManagement() {
	const [employees, setEmployees] = React.useState<Employee[]>([]);
	const [employee, setEmployee] = React.useState<Employee>();
	const [branches, setBranches] = React.useState<Branch[]>([]);
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [locations, setLocations] = React.useState<Location[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const { data: session } = useSession();

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	React.useEffect(() => {
		const fetchEmployeesByBranch = async (branchName: string) => {
			try {
				const response = await fetch(`/api/employeesByBranch/${branchName}`, {
					method: "GET",
					cache: "no-cache",
				});

				const palyload = (await response.json()) as ApiResponse;
				console.log(palyload);
				if (palyload.ok) {
					setEmployees(palyload.data);
					toast.success(palyload.message);
				} else {
					toast.error(palyload.message);
				}
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchEmployeesByBranch;
	});
	// fetch data
	React.useEffect(() => {
		Promise.all([
			fetchBranches(),
			fetchRolesWithPermission(),
			fetchLocations(),
		]).then(data => {
			const [branchRes, roleRes, locationRes] = data;

			if (branchRes.ok) {
				setBranches(branchRes.data);
			}

			if (roleRes.ok) {
				setRoles(roleRes.data);
			}

			if (locationRes.ok) {
				setLocations(locationRes.data);
			}

			setLoading(false);
		});
	}, []);

	// Handle Search
	function handleSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nameInput = document.getElementById(
			"searchInput"
		) as HTMLInputElement;
		const name = nameInput.value.trim();

		if (name === "") {
			fetchEmployees().then(data => {
				if (data.ok) {
					setEmployees(data.data);
				}
			});
		} else {
			const filterEmployees = employees.filter(
				employee =>
					employee.fullname.toLowerCase().includes(name.toLowerCase()) ||
					employee.email.toLowerCase().includes(name.toLowerCase()) ||
					employee.branchName.toLowerCase().includes(name.toLowerCase()) ||
					employee.roleName.toLowerCase().includes(name.toLowerCase()) ||
					employee.phoneNumber.includes(name)
			);

			setEmployees(filterEmployees);
		}
	}
	// Handle Change Status
	function handleChangeStatus(id: number) {
		fetchChangeStatus(id)
			.then(() => {
				const updatedEmployees = employees.map(employee => {
					if (employee.id === id && employee.status === 1) {
						return {
							...employee,
							status: 0,
						};
					} else if (employee.id === id && employee.status === 0) {
						return {
							...employee,
							status: 1,
						};
					}
					return employee;
				});
				setEmployees(updatedEmployees);
				toast.success("Change status successfully.");
			})
			.catch(error => {
				console.log(error);
				toast.error("Failed to change status !");
			});
	}

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<>
					<Box className="mb-3 flex justify-between items-center">
						{/* Handle Search */}
						<form
							onSubmit={handleSearch}
							method="post"
							className="flex justify-end items-center py-4 ">
							<input
								type="text"
								name="search"
								id="searchInput"
								className="mr-2 px-2 text-[14px] rounded-md max-w-[400px] h-[30px] cursor-pointer"
								placeholder="Enter name to search"
							/>
							<Button
								color="success"
								variant="contained"
								size="small"
								className="rounded-md">
								Search
							</Button>
						</form>
					</Box>
					<TableContainer sx={{ width: "100%", overflow: "hidden" }}>
						<Table
							sx={{ minWidth: 650 }}
							size="small"
							aria-label="a dense table">
							<TableHead>
								<TableRow>
									<TableCell
										align="center"
										className="text-white text-sm">
										#
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Fullname
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Email
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Phone
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Branch
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Role
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Status
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{employees.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											align="center"
											className="text-sm">
											No Data
										</TableCell>
									</TableRow>
								)}
								{employees.map(employee => (
									<TableRow
										key={employee.id}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										<TableCell align="center">
											{employee.employeeCode}
										</TableCell>
										<TableCell align="center">{employee.fullname}</TableCell>
										<TableCell align="center">{employee.email}</TableCell>
										<TableCell align="center">{employee.phoneNumber}</TableCell>
										<TableCell align="center">{employee.branchName}</TableCell>
										<TableCell align="center">{employee.roleName}</TableCell>
										<TableCell align="center">
											<Switch
												size="small"
												color="success"
												className="cursor-pointer"
												checked={employee.status == 1 ? true : false}
												onChange={() => handleChangeStatus(employee.id)}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						component="div"
						count={employees.length || 0}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</>
			)}
		</>
	);
}
function fetchEmployeesByBranch(): any {
	throw new Error("Function not implemented.");
}
