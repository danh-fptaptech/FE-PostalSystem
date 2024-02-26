"use client";

import React from "react";
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
	fetchUpdateAsync,
	UpdateEmployeeRequest,
} from "@/libs/data";
import {
	Avatar,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Paper,
	Switch,
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

const columns = [
	{ title: "#" },
	{ title: "Full name" },
	{ title: "Email" },
	{ title: "Phone" },
	{ title: "Branch" },
	{ title: "Role" },
	{ title: "Status" },
	{ title: "" },
];

export default function EmployeeManagement() {
	const [employees, setEmployees] = React.useState<Employee[]>([]);
	const [employee, setEmployee] = React.useState<Employee>();
	const [branches, setBranches] = React.useState<Branch[]>([]);
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [locations, setLocations] = React.useState<Location[]>([]);
	const [selectedProvince, setSelectedProvince] = React.useState("");
	const [currentPage, setCurrentPage] = React.useState(1);
	const [isLoading, setIsLoading] = React.useState(true);
	const [selectAllChecked, setSelectAllChecked] = React.useState(false);
	const [openAddForm, setOpenAddForm] = React.useState(false);
	const [openUpdateForm, setOpenUpdateForm] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);
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

			if (employeeRes.ok) {
				setEmployees(employeeRes.data);
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

	// Handle Pagination
	const PAGE_SIZE = 5;
	const totalPages = Math.ceil(employees.length / PAGE_SIZE);
	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;
	const currentEmployees = employees.slice(startIndex, endIndex);
	function handlePageChange(selectedPage: number) {
		setCurrentPage(selectedPage);
	}
	// Handle Check All
	function handleSelectedAll(event: React.ChangeEvent<HTMLInputElement>) {
		const checked = event.target.checked;
		setSelectAllChecked(checked);

		const updateEmployees = employees.map(employee => ({
			...employee,
			selected: checked,
		}));
		setEmployees(updateEmployees);
	}
	// Handle Check
	function handleSelected(employeeId: number) {
		const updateEmployees = employees.map(employee => {
			if (employee.id === employeeId) {
				return {
					...employee,
					selected: !employee.selected,
				};
			}
			return employee;
		});
		setEmployees(updateEmployees);

		const allSelected = updateEmployees.every(employee => employee.selected);
		setSelectAllChecked(allSelected);
	}
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
					} else {
						return {
							...employee,
							status: 1,
						};
					}
				});
				setEmployees(updatedEmployees);
				toast.success("Change status successfully.");
			})
			.catch(error => {
				console.log(error);
				toast.error("Failed to change status !");
			});
	}

	// Add employee => còn lỗi select roleId, branchId
	async function AddEmployee(employee: CreateEmployeeRequest) {
		console.log(employee);
		const res = await fetch("/api/employees", {
			method: "POST",
			body: JSON.stringify(employee),
		});

		const payload = (await res.json()) as ApiResponse;

		if (payload.ok) {
			const response = await fetchEmployees();
			setEmployees(await response.data);
			setOpenAddForm(false);
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
	}

	// Update Employee
	async function UpdateEmployee(updatedEmployee: UpdateEmployeeRequest) {
		try {
			const res = await fetch(`/api/employees/${employee?.id}`, {
				method: "PUT",
				body: JSON.stringify(updatedEmployee),
			});

			const payload = (await res.json()) as ApiResponse;

			if (payload.ok) {
				const response = await fetchEmployees();
				setEmployees(await response.data);
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
					<div className="mb-2 flex justify-between items-center">
						<button
							className="btn btn-dark"
							onClick={() => setOpenAddForm(true)}>
							+ Add
						</button>
						{/* Handle Search */}
						<form
							onSubmit={handleSearch}
							method="post"
							className="flex justify-end items-center py-4 ">
							<input
								type="text"
								name="search"
								id="searchInput"
								className="mr-2 text-[14px] border-slate-400 max-w-[400px] h-[35px] cursor-pointer"
								placeholder="Enter name to search"
							/>
							<button className="btn btn-success">Search</button>
						</form>
					</div>
					{/* Display All Employee */}
					<table
						width="100%"
						className="mr-4 ml-2">
						<thead className="text-white text-[14px]">
							<tr>
								<th>
									<input
										type="checkbox"
										className="ml-1"
										checked={selectAllChecked}
										onChange={handleSelectedAll}
									/>
								</th>

								{columns.map(column => {
									return (
										<th
											key={column.title}
											align="center">
											{column.title}
										</th>
									);
								})}
							</tr>
						</thead>

						<tbody>
							{currentEmployees.reverse().map(employee => {
								return (
									<tr
										key={employee.id}
										className="text-slate-500">
										<td>
											<input
												type="checkbox"
												checked={employee.selected}
												onChange={() => handleSelected(employee.id)}
											/>
										</td>
										<td>{employee.employeeCode}</td>
										<td>{employee.fullname}</td>
										<td>{employee.email}</td>
										<td>{employee.phoneNumber}</td>
										<td>{employee.branchName}</td>
										<td>
											<span
												className={
													employee.roleName === "Admin"
														? "p-2 bg-green-800 p-2 text-white rounded-md"
														: "p-2 bg-yellow-600 p-2 text-white rounded-md"
												}>
												{employee.roleName}
											</span>
										</td>
										<td>
											<Switch
												size="small"
												color="success"
												className="cursor-pointer"
												checked={employee.status == 1 ? true : false}
												onChange={() => handleChangeStatus(employee.id)}
											/>
										</td>
										<td>
											<Tooltip title="Edit">
												<Button
													type="button"
													endIcon={<DriveFileRenameOutline fontSize="medium" />}
													variant="text"
													color="success"
													onClick={() => {
														setEmployee(employee);
														setOpenUpdateForm(true);
													}}>
													{/* <DriveFileRenameOutline className="text-green-700 text-[20px]" /> */}
												</Button>
											</Tooltip>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>

					{/* Pagination */}
					<div className="flex justify-center items-center mt-4">
						<button
							disabled={currentPage === 1}
							onClick={() => handlePageChange(currentPage - 1)}
							className={`${
								currentPage === 1
									? "cursor-not-allowed btn-previous"
									: "btn-previous cursor-pointer hover:opacity-80"
							}`}>
							<SkipPrevious fontSize="small" />
						</button>
						<span className="text-sm mx-2">
							Page {currentPage} of {totalPages}
						</span>
						<button
							disabled={currentPage === totalPages}
							onClick={() => handlePageChange(currentPage + 1)}
							className={`${
								currentPage === totalPages
									? "cursor-not-allowed btn-next"
									: "btn-next cursor-pointer hover:opacity-80"
							}`}>
							<SkipNext fontSize="small" />
						</button>
					</div>

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
								{/* Select: district, province */}
								<div className="my-3 flex">
									<div className="mr-2">
										<label className="font-semibold">Province:</label>
										<select
											{...register("province")}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											name="province"
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
											name="district"
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
											name="branch"
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
											name="role"
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
										className="w-full btn btn-success">
										+ Add New
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					{/* Update Employee Information => còn lỗi */}
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

							<div className="my-3 flex justify-center items-center">
								<Avatar
									src={
										employee.avatar
											? `/${employee.avatar.toString()}`
											: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
									}
									alt={employee.employeeCode}
									className="aspect-square "
								/>
								<DialogTitle className="text-center mt-2">
									Updated Employee
								</DialogTitle>
							</div>

							<DialogContent>
								<form
									onSubmit={handleUpdatedSubmit(UpdateEmployee)}
									className="text-xs">
									<div className="my-3">
										<label className="font-semibold">Employee Code:</label>
										<input
											readOnly
											value={employee.employeeCode}
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										/>
									</div>

									<div className="my-3">
										<label className="font-semibold">Fullname:</label>
										<input
											{...updatedRegister("fullname", {
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
											value={employee.fullname}
											placeholder="Fullname"
										/>
										<span className="text-danger ">
											{errors.fullname?.message}
										</span>
									</div>

									<div className="my-3">
										<label className="font-semibold">Email:</label>
										<input
											{...updatedRegister("email", {
												required: "Email is required.",
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message: "Invalid email address format.",
												},
											})}
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={employee.email}
											placeholder="Email"
										/>
										<span className="text-danger ">
											{errors.email?.message}
										</span>
									</div>

									<div className="my-3">
										<label className="font-semibold">Password:</label>
										<div className="relative">
											<input
												type={showPassword ? "text" : "password"}
												{...updatedRegister("password", {
													required: "Password is required.",
													minLength: {
														value: 8,
														message: "Password must be at least 8 characters.",
													},
												})}
												className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												value={employee.password}
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
											{...updatedRegister("phoneNumber", {
												required: "Phone number is required.",
												pattern: {
													value: /^\d{10}$/,
													message: "Phone number must have 10 digits.",
												},
											})}
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={employee.phoneNumber}
											placeholder="Phone number"
										/>
										<span className="text-danger ">
											{errors.phoneNumber?.message}
										</span>
									</div>

									<div className="my-3">
										<label className="font-semibold">Address:</label>
										<textarea
											{...updatedRegister("address", {
												required: "Address is required.",
											})}
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={employee.address}
											placeholder="Address"></textarea>
										<span className="text-danger ">
											{errors.address?.message}
										</span>
									</div>
									{/* Select: district, province */}
									<div className="my-3 flex">
										<div className="mr-2">
											<label className="font-semibold">Province:</label>
											<select
												{...updatedRegister("province")}
												className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												name="province"
												id="province"
												value={employee.province}>
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
												{...updatedRegister("district")}
												className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												name="district"
												id="district"
												value={employee.district}>
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
											{...updatedRegister("avatar", { required: false })}
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											placeholder="Avatar"
										/>
										<span className="text-danger">
											{errors.avatar?.message}
										</span>
									</div>
									{/* Select branch, role */}
									<div className="my-3 flex">
										<div className="mr-2">
											<label className="font-semibold">Branch:</label>
											<select
												{...updatedRegister("branchId")}
												className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												name="branch"
												id="branch"
												value={employee.branchName}>
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
												name="role"
												id="role"
												value={employee.roleName}>
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
											className="w-full btn btn-success">
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
