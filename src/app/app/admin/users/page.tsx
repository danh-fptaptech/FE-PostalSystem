"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/app/components/Loading";
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
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
	Update,
	SearchOutlined,
} from "@mui/icons-material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
	ApiResponse,
	User,
	Role,
	Province,
	CreateEmployeeRequest,
	UpdateEmployeeRequest,
} from "@/types/types";
import { toast } from "sonner";
import {
	getProvinces,
	getChildrenLocationsByParentId,
	fetchUsers,
	fetchRolesWithPermission,
	fetchChangeStatus,
} from "@/app/_data/index";
import { useSession } from "next-auth/react";

export default function UserManagement() {
	const [users, setUsers] = React.useState<User[]>([]);
	const [user, setUser] = React.useState<User>();
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [provinces, setProvinces] = React.useState<Province[]>([]);
	const [districts, setDistricts] = React.useState<Province[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [openAddForm, setOpenAddForm] = React.useState(false);
	const [openUpdateForm, setOpenUpdateForm] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const { data: session, status } = useSession();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<CreateEmployeeRequest>();

	const province = watch("province");

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

	// fetch data
	React.useEffect(() => {
		Promise.all([
			fetchUsers(),
			fetchRolesWithPermission(),
			getProvinces(),
		]).then(data => {
			const [userRes, roleRes, provinceRes] = data;

			if (userRes.ok) {
				setUsers(userRes.data.reverse());
			}

			if (roleRes.ok) {
				setRoles(roleRes.data);
			}

			if (provinceRes.ok) {
				setProvinces(provinceRes.data);
			}

			setLoading(false);
		});
	}, []);

	React.useEffect(() => {
		const provinceId = provinces.find(p => p.locationName === province)?.id;

		if (!provinceId) {
			setDistricts([]);
		} else {
			getChildrenLocationsByParentId(provinceId).then(res => {
				if (res.ok) {
					if (res.data.districs) {
						setDistricts(res.data.districs);
					} else {
						setDistricts([]);
					}
				} else {
					setDistricts([]);
				}
			});
		}
	}, [province, provinces]);

	// Handle Search
	function handleSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nameInput = document.getElementById(
			"searchInput"
		) as HTMLInputElement;
		const name = nameInput.value.trim();

		if (name === "") {
			fetchUsers().then(data => {
				if (data.ok) {
					setUsers(data.data.reverse());
				}
			});
		} else {
			const filterUsers = users.filter(
				user =>
					user.fullname.toLowerCase().includes(name.toLowerCase()) ||
					user.email.toLowerCase().includes(name.toLowerCase()) ||
					user.phoneNumber.includes(name)
			);

			setUsers(filterUsers);
		}
	}
	// Handle Change Status
	// function handleChangeStatus(id: number) {
	// 	const loadingId = toast.loading("Loading...");
	// 	fetchChangeStatus(id)
	// 		.then(() => {
	// 			const updatedEmployees = employees.map(employee => {
	// 				if (employee.id === id && employee.status === 1) {
	// 					return {
	// 						...employee,
	// 						status: 0,
	// 					};
	// 				} else if (employee.id === id && employee.status === 0) {
	// 					return {
	// 						...employee,
	// 						status: 1,
	// 					};
	// 				}
	// 				return employee;
	// 			});
	// 			setEmployees(updatedEmployees);
	// 			toast.success("Change status successfully.");
	// 		})
	// 		.catch(error => {
	// 			console.log(error);
	// 			toast.error("Failed to change status !");
	// 		});
	// 	toast.dismiss(loadingId);
	// }

	// Add employee
	// async function AddEmployee(employee: CreateEmployeeRequest) {
	// 	const loadingId = toast.loading("Loading...");
	// 	try {
	// 		// const uploadFile = await uploadFileS3(file);
	// 		// employee.avatar = uploadFile;
	// 		const res = await fetch("/api/employees", {
	// 			method: "POST",
	// 			body: JSON.stringify(employee),
	// 		});

	// 		const payload = (await res.json()) as ApiResponse;

	// 		if (payload.ok) {
	// 			const response = await fetchEmployees();
	// 			setEmployees(await response.data);
	// 			setOpenAddForm(false);
	// 			toast.success(payload.message);
	// 		} else {
	// 			toast.error(payload.message);
	// 		}
	// 	} catch (error) {
	// 		console.log("Error upload file or add employee: ", error);
	// 		toast.error("Oops! Error while trying to upload file or add employee.");
	// 	}
	// 	toast.dismiss(loadingId);
	// }

	// Update Employee
	// async function UpdateEmployee(updatedEmployee: UpdateEmployeeRequest) {
	// 	const loadingId = toast.loading("Loading...");
	// 	const res = await fetch(`/api/employees/${employee?.employeeCode}`, {
	// 		method: "PUT",
	// 		body: JSON.stringify(updatedEmployee),
	// 	});

	// 	const payload = (await res.json()) as ApiResponse;

	// 	if (payload.ok) {
	// 		const response = await fetchEmployees();
	// 		setEmployees(await response.data.reverse());
	// 		setOpenUpdateForm(false);
	// 		toast.success(payload.message);
	// 	} else {
	// 		toast.error(payload.message);
	// 	}
	// 	toast.dismiss(loadingId);
	// }
	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="mt-4">
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
										Phone Number
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Avatar
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Role
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Action
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{users.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={7}
											align="center"
											className="text-sm">
											No data ...
										</TableCell>
									</TableRow>
								)}
								{users
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map(user => {
										return (
											<TableRow
												key={user.id}
												sx={{
													"&:last-child td, &:last-child th": { border: 0 },
												}}>
												<TableCell align="center">{user.id}</TableCell>
												<TableCell align="center">{user.fullname}</TableCell>
												<TableCell align="center">{user.email}</TableCell>
												<TableCell align="center">{user.phoneNumber}</TableCell>
												<TableCell align="center">
													<Avatar
														src={user.avatar}
														alt={user.fullname}
													/>
												</TableCell>
												<TableCell align="center">
													{user.createAt.split("T")[0]}
												</TableCell>
												<TableCell align="center">
													<Switch
														size="small"
														color="success"
														className="cursor-pointer"
														checked={user.status == 1 ? true : false}
													/>
												</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
						<TablePagination
							component="div"
							count={users.length || 0}
							page={page}
							onPageChange={handleChangePage}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>
				</div>
			)}
		</>
	);
}
