"use client";

import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/app/components/Loading";
import {
	Employee,
	Branch,
	Role,
	Location,
	CreateEmployeeRequest,
	fetchEmployees,
	fetchBranches,
	fetchRolesWithPermission,
	fetchLocations,
	fetchChangeStatus,
	UpdateEmployeeRequest,
} from "@/libs/data";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Paper,
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
import {
	CloseOutlined,
	DriveFileRenameOutline,
	SkipNext,
	SkipPrevious,
} from "@mui/icons-material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ApiResponse } from "@/types/types";
import { toast } from "sonner";

const SCHEME = z.object({
	employeeCode: z.string(),
	fullname: z.string(),
	avatar: z.string(),
	email: z.string().email(),
	password: z.string(),
	phoneNumber: z.string(),
	address: z.string(),
	province: z.string(),
	district: z.string(),
	branchId: z.number(),
	roleId: z.number(),
});

export default function EmployeeManagement() {
	const [employees, setEmployees] = React.useState<Employee[]>([]);
	const [employee, setEmployee] = React.useState<Employee>();
	const [branches, setBranches] = React.useState<Branch[]>([]);
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [locations, setLocations] = React.useState<Location[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [openAddForm, setOpenAddForm] = React.useState(false);
	const [openUpdateForm, setOpenUpdateForm] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<CreateEmployeeRequest>();

	const {
		register: updatedRegister,
		handleSubmit: handleUpdatedSubmit,
		formState: { errors: updatedErrors },
	} = useForm<UpdateEmployeeRequest>();

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

	// Generate employeeCode
	function generateEmployeeCode() {
		const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
		setValue("employeeCode", `EMP-${randomCode}`);
	}
	// fetch data
	React.useEffect(() => {
		Promise.all([
			fetchEmployees(),
			fetchBranches(),
			fetchRolesWithPermission(),
			fetchLocations(),
		]).then(data => {
			const [employeeRes, branchRes, roleRes, locationRes] = data;
			console.log(employeeRes);

			if (employeeRes.ok) {
				setEmployees(employeeRes.data.reverse());
			}

			if (branchRes.ok) {
				setBranches(branchRes.data);
			}

			if (roleRes.ok) {
				setRoles(roleRes.data);
			}

			if (locationRes.ok) {
				setLocations(locationRes.data);
			}

			setIsLoading(false);
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

	// Add employee
	async function AddEmployee(employee: CreateEmployeeRequest) {
		const res = await fetch("/api/employees", {
			method: "POST",
			body: JSON.stringify(employee),
		});

		const payload = (await res.json()) as ApiResponse;

		if (payload.ok) {
			const response = await fetchEmployees();
			setEmployees((await response.data).reverse());
			setOpenAddForm(false);
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
	}

	// Update Employee
	async function UpdateEmployee(updatedEmployee: UpdateEmployeeRequest) {
		try {
			const res = await fetch(`/api/employees/${employee?.employeeCode}`, {
				method: "PUT",
				body: JSON.stringify(updatedEmployee),
			});

			const payload = (await res.json()) as ApiResponse;
			console.log(payload);

			if (payload.ok) {
				const response = await fetchEmployees();
				setEmployees(await response.data.reverse());
				setOpenUpdateForm(false);
				toast.success(payload.message);
			} else {
				toast.error(payload.message);
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="w-full">
			{isLoading ? (
				<Loading />
			) : (
				<div>
					<div className="mb-3 flex justify-between items-center">
						<Button
							color="secondary"
							variant="contained"
							className="rounded-md"
							size="small"
							onClick={() => setOpenAddForm(true)}>
							+ Add
						</Button>
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
					</div>
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
									<TableCell
										align="center"
										className="text-white text-sm">
										Action
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
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
										<TableCell align="center">
											<Tooltip title="Edit">
												<Button
													type="button"
													endIcon={<DriveFileRenameOutline fontSize="medium" />}
													variant="text"
													color="success"
													onClick={() => {
														setEmployee(employee);
														setOpenUpdateForm(true);
													}}></Button>
											</Tooltip>
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

					{/* Add New Employee */}
					<Dialog
						open={openAddForm}
						onClose={() => setOpenAddForm(false)}
						className="max-w-[500px] mx-auto">
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setOpenAddForm(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<DialogTitle className="text-center mt-2">
							Add New Employee
						</DialogTitle>

						<DialogContent>
							<form
								onSubmit={handleSubmit(AddEmployee)}
								className="text-xs">
								<div className="my-3">
									<label className="font-semibold">Employee Code:</label>
									<div className="relative">
										<input
											{...register("employeeCode", {
												required: "EmployeeCode is required.",
											})}
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											placeholder="EMP-000001"
										/>
										<button
											type="button"
											onClick={generateEmployeeCode}
											className="absolute inset-y-0 right-0 bg-slate-800 p-2 text-white uppercase rounded-md hover:opacity-85 cursor-pointer">
											Generate
										</button>
									</div>
									<span className="text-danger ">
										{errors.employeeCode?.message}
									</span>
								</div>

								<div className="my-3">
									<label className="font-semibold">Fullname:</label>
									<input
										{...register("fullname", {
											required: "Fullname is required.",
											minLength: {
												value: 8,
												message: "Fullname must be at least 8 chatacters.",
											},
											maxLength: {
												value: 50,
												message: "Fullname must be less than 50 chatacters.",
											},
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										placeholder="Fullname"
									/>
									<span className="text-danger ">
										{errors.fullname?.message}
									</span>
								</div>

								<div className="my-3">
									<label className="font-semibold">Email:</label>
									<input
										{...register("email", {
											required: "Email is required.",
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: "Invalid email address format.",
											},
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										placeholder="Email"
									/>
									<span className="text-danger ">{errors.email?.message}</span>
								</div>

								<div className="my-3">
									<label className="font-semibold">Password:</label>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											{...register("password", {
												required: "Password is required.",
												minLength: {
													value: 8,
													message: "Password must be at least 8 characters.",
												},
											})}
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											placeholder="Password"
										/>
										<div className="absolute inset-y-0 right-0 flex items-center pr-3">
											<Button
												type="button"
												endIcon={
													showPassword ? (
														<VisibilityOutlinedIcon fontSize="small" />
													) : (
														<VisibilityOffOutlinedIcon fontSize="small" />
													)
												}
												onClick={() => setShowPassword(!showPassword)}
												className="focus:outline-none"></Button>
										</div>
										<span className="text-danger ">
											{errors.password?.message}
										</span>
									</div>
								</div>

								<div className="my-3">
									<label className="font-semibold">Phone number:</label>
									<input
										{...register("phoneNumber", {
											required: "Phone number is required.",
											pattern: {
												value: /^\d{10}$/,
												message: "Phone number must have 10 digits.",
											},
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										placeholder="Phone number"
									/>
									<span className="text-danger ">
										{errors.phoneNumber?.message}
									</span>
								</div>

								<div className="my-3">
									<label className="font-semibold">Postal Code:</label>
									<input
										{...register("postalCode", {
											required: "Postal code is required.",
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										placeholder="Postal Code"
									/>
									<span className="text-danger ">
										{errors.postalCode?.message}
									</span>
								</div>

								<div className="my-3">
									<label className="font-semibold">Address:</label>
									<textarea
										{...register("address", {
											required: "Address is required.",
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										placeholder="Address"></textarea>
									<span className="text-danger ">
										{errors.address?.message}
									</span>
								</div>

								<div className="my-3 flex">
									<div className="mr-2">
										<label className="font-semibold">Province:</label>
										<select
											{...register("province")}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											id="province">
											<option>Select province</option>
											{locations
												.filter(location => location.locationLevel === 0)
												.map(province => (
													<option
														key={province.id}
														value={province.locationName}>
														{province.locationName}
													</option>
												))}
										</select>
									</div>

									<div>
										<label className="font-semibold">District:</label>
										<select
											{...register("district")}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											id="district">
											<option>Select district</option>
											{locations
												.filter(location => location.locationLevel === 1)
												.map(district => (
													<option
														key={district.id}
														value={district.locationName}>
														{district.locationName}
													</option>
												))}
										</select>
									</div>
								</div>

								<div className="my-3">
									<label className="font-semibold">Upload Avatar:</label>
									<input
										type="file"
										{...register("avatar", { required: false })}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										placeholder="Avatar"
									/>
									<span className="text-danger">{errors.avatar?.message}</span>
								</div>
								{/* Select branch, role */}
								<div className="my-3 flex">
									<div className="mr-2">
										<label className="font-semibold">Branch:</label>
										<select
											{...register("branchId")}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											id="branch">
											{branches.map(branch => (
												<option
													key={branch.id}
													value={branch.id}>
													{branch.branchName}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="font-semibold">Role:</label>
										<select
											{...register("roleId")}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											id="role">
											{roles.map(role => (
												<option
													key={role.id}
													value={role.id}>
													{role.name}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="flex justify-around mb-2 mt-10">
									<Button
										type="submit"
										color="success"
										variant="contained"
										size="medium"
										className="w-full">
										+ Add New
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					{/* Update Employee Information */}
					{employee && (
						<Dialog
							open={openUpdateForm}
							onClose={() => setOpenUpdateForm(false)}
							className="max-w-[500px] mx-auto">
							<Tooltip title="Close">
								<CloseOutlined
									onClick={() => setOpenUpdateForm(false)}
									color="error"
									className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
								/>
							</Tooltip>

							<DialogTitle className="text-center mt-2">
								Updated Employee
							</DialogTitle>

							<DialogContent>
								<form
									onSubmit={handleUpdatedSubmit(UpdateEmployee)}
									className="text-xs">
									<div className="my-3">
										<label className="font-semibold">Employee Code:</label>
										<input
											value={employee.employeeCode}
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											readOnly
											disabled
										/>
									</div>

									<div className="my-3">
										<label className="font-semibold">Fullname:</label>
										<input
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={employee.fullname}
											readOnly
											disabled
										/>
									</div>

									{/* Select branch, role */}
									<div className="my-3 flex">
										<div className="mr-2">
											<label className="font-semibold">Branch:</label>
											<select
												{...updatedRegister("branchId")}
												className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												defaultValue={employee.branchName}
												id="branch">
												{branches.map(branch => (
													<option
														key={branch.id}
														value={branch.id}>
														{branch.branchName}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="font-semibold">Role:</label>
											<select
												{...updatedRegister("roleId")}
												className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												defaultValue={employee.roleName}
												id="role">
												{roles.map(role => (
													<option
														key={role.id}
														value={role.id}>
														{role.name}
													</option>
												))}
											</select>
										</div>
									</div>

									<div className="flex justify-around mb-2 mt-10">
										<Button
											type="submit"
											color="success"
											variant="contained"
											size="medium"
											className="w-full">
											Update
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					)}
				</div>
			)}
		</div>
	);
}