"use client";

import Loading from "@/components/Loading";
import { fetchPermissions, fetchRolesWithPermission } from "@/app/_data/index";
import {
	Avatar,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Tooltip,
	Chip,
	Input,
	Autocomplete,
	Checkbox,
	TextField,
	Card,
	Box,
	CardContent,
	CardActions,
	Typography,
} from "@mui/material";
import {
	CloseOutlined,
	AddCircle,
	DeleteOutline,
	CheckBoxOutlineBlank,
	CheckBox,
} from "@mui/icons-material";
import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";
import {
	ApiResponse,
	CreatePermission,
	CreatePermissionRequest,
	CreateRoleRequest,
	Permission,
	Role,
} from "@/types/types";
import { toast } from "sonner";

export default function RoleManagement() {
	const [selectedRoleId, setSelectedRoleId] = React.useState<Number>(0);
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [permissions, setPermissions] = React.useState<Permission[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [openAddPermisson, setOpenAddPermisson] = React.useState(false);
	const [openAddRole, setOpenAddRole] = React.useState(false);
	const [createPermission, setCreatePermission] = React.useState(false);

	const {
		register: roleRegister,
		handleSubmit: roleHandleSubmit,
		formState: { errors: roleErrors },
	} = useForm<CreateRoleRequest>();

	const {
		register: permissionRegister,
		handleSubmit: permissionHandleSubmit,
		formState: { errors: permissionErrors },
		setValue,
	} = useForm<CreatePermissionRequest>();

	const {
		register,
		handleSubmit,
		formState: { errors: errors },
	} = useForm<CreatePermission>();

	// fetch data
	React.useEffect(() => {
		Promise.all([fetchRolesWithPermission(), fetchPermissions()]).then(data => {
			const [rolesRes, permissionRes] = data;
			if (rolesRes.ok) {
				setRoles(rolesRes.data);
			}
			if (permissionRes.ok) {
				setPermissions(permissionRes.data);
			}
			setIsLoading(false);
		});
	}, []);

	const handlePermissionChange = (
		event: any,
		value: { permissionName: any }[]
	) => {
		setValue(
			"permissionNames",
			value.map((v: { permissionName: any }) => v.permissionName)
		);
	};

	// Add new role
	async function AddRole(role: CreateRoleRequest) {
		const loadingId = toast.loading("Loading...");
		try {
			const res = await fetch("/api/roles/", {
				method: "POST",
				body: JSON.stringify(role),
			});

			const payload = (await res.json()) as ApiResponse;

			if (payload.ok) {
				const response = await fetchRolesWithPermission();
				setRoles(await response.data);
				setOpenAddRole(false);
				toast.success(payload.message);
			} else {
				toast.error(payload.message);
			}
		} catch (error) {
			console.log(error);
		}
		toast.dismiss(loadingId);
	}
	// Remove role
	const handleDeleteRole = async (roleId: number) => {
		const loadingId = toast.loading("Loading...");
		const response = await fetch(`/api/roles/${roleId}`, {
			method: "DELETE",
		});

		const payload = (await response.json()) as ApiResponse;

		if (roleId <= 4 && payload.ok) {
			toast.error("Failed to delete! The role is one of system roles.");
		} else if (roleId > 4 && payload.ok) {
			setRoles(pre => pre.filter(role => role.id !== roleId));
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
		toast.dismiss(loadingId);
	};
	//Create permission
	async function createOnePermission(formData: CreatePermission) {
		const loadingId = toast.loading("Loading...");
		const res = await fetch(`/api/permissions`, {
			method: "POST",
			body: JSON.stringify(formData),
		});

		const payload = (await res.json()) as ApiResponse;

		if (payload.ok) {
			const response = await fetchPermissions();
			setPermissions(await response.data);
			setCreatePermission(false);
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
		toast.dismiss(loadingId);
	}
	// Add permissions into role
	async function AddPermission(formData: CreatePermissionRequest) {
		const loadingId = toast.loading("Loading...");
		const res = await fetch(`/api/roles/${selectedRoleId}/permission`, {
			method: "POST",
			body: JSON.stringify(formData),
		});

		const payload = (await res.json()) as ApiResponse;

		if (payload.ok) {
			setRoles(pre => {
				return pre.map(role => {
					if (role.id === payload.data.id) {
						return payload.data;
					}
					return role;
				});
			});
			setOpenAddPermisson(false);
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
		toast.dismiss(loadingId);
	}

	// Remove permission from role
	const handleDelete = async (roleId: number, permissionName: string) => {
		const loadingId = toast.loading("Loading...");
		const res = await fetch(
			`/api/roles/${roleId}/permission/${permissionName}`,
			{
				method: "DELETE",
			}
		);

		const payload = (await res.json()) as ApiResponse;

		if (payload.ok) {
			setRoles(pre =>
				pre.map(role => {
					if (role.id === roleId) {
						const index = role.roleHasPermissions.findIndex(
							rhp => rhp === permissionName
						);
						role.roleHasPermissions.splice(index, 1);
					}
					return role;
				})
			);
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
		toast.dismiss(loadingId);
	};

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className="mt-4">
					<Box className="mx-2 flex justify-between items-center">
						<Button
							color="secondary"
							variant="contained"
							size="small"
							className="mb-3"
							onClick={() => setOpenAddRole(true)}>
							<Tooltip title="Add Role">
								<Typography>+ Add</Typography>
							</Tooltip>
						</Button>
					</Box>

					{/* Role card */}
					<Box className="grid sm:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-10">
						{roles.map(role => (
							<Card
								key={role.id}
								className="relative mx-2 px-1 rounded-md hover:shadow-lg cursor-pointer">
								<CardContent className="relative">
									<Box className="w-full h-full flex justify-between items-center">
										<Avatar
											src="data:image/png;base64,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"
											alt={role.name}
											className="w-16 h-16"
										/>
										<Box className="">
											<Typography
												className={
													role.name === "Admin"
														? "text-green-700 font-semibold"
														: "text-orange-400"
												}>
												{role.name}
											</Typography>
										</Box>
									</Box>

									<Box className="min-h-[200px]">
										<Typography className="text-xs my-2">
											{role.name} has {role.roleHasPermissions.length}{" "}
											permission.
										</Typography>
										{role.roleHasPermissions.map(permission => (
											<Chip
												key={permission}
												label={permission}
												color="default"
												variant="outlined"
												size="small"
												className="text-xs mr-1"
												onDelete={() => {
													handleDelete(role.id, permission);
												}}
											/>
										))}
									</Box>
								</CardContent>

								<CardActions className="absolute inset-x-0 bottom-1 mt-10 flex justify-between items-center">
									<Tooltip title="Add Permission">
										<Button
											onClick={() => {
												setOpenAddPermisson(true);
												setSelectedRoleId(role.id);
											}}
											size="small"
											color="info"
											variant="text"
											className="rounded-full hover:opacity-75">
											<AddCircle fontSize="small" />
										</Button>
									</Tooltip>

									<Tooltip title="Remove Role">
										<Button
											onClick={() => {
												if (confirm("Are your sure to remove this role ?")) {
													handleDeleteRole(role.id);
												}
											}}
											size="small"
											color="error"
											variant="text"
											className="rounded-full hover:opacity-75">
											<DeleteOutline fontSize="small" />
										</Button>
									</Tooltip>
								</CardActions>
							</Card>
						))}
					</Box>

					{/* Form add new role */}
					<Dialog
						open={openAddRole}
						onClose={() => setOpenAddRole(false)}
						className="max-w-[500px] mx-auto">
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setOpenAddRole(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<DialogTitle className="text-center mt-2">Add Role</DialogTitle>

						<DialogContent>
							<form
								onSubmit={roleHandleSubmit(AddRole)}
								className="text-xs">
								<div className="my-3">
									<div>
										<label className="font-semibold">Name:</label>
									</div>
									<Input
										autoFocus
										color="info"
										style={{ width: 350 }}
										{...roleRegister("name", {
											required: "Role name is required.",
										})}
										placeholder="Enter role name"
									/>
								</div>

								<span className="text-danger">{roleErrors.name?.message}</span>

								<div className="flex justify-around my-3">
									<Button
										color="success"
										variant="contained"
										size="medium"
										type="submit"
										className="w-full">
										+ Add New
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					{/* Form add permissions into role */}
					<Dialog
						open={openAddPermisson}
						onClose={() => setOpenAddPermisson(false)}
						className="mx-auto">
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setOpenAddPermisson(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<DialogTitle className="text-center mt-2">
							Add Permissions
						</DialogTitle>

						<DialogContent>
							<form className="text-xs">
								<Autocomplete
									{...permissionRegister("permissionNames")}
									className="my-2"
									color="secondary"
									multiple
									id="checkboxes-tags-demo"
									options={permissions}
									disableCloseOnSelect
									getOptionLabel={option => option.permissionName}
									renderOption={(props, option, { selected }) => (
										<li
											key={option.permissionName}
											{...props}>
											<Checkbox
												icon={<CheckBoxOutlineBlank fontSize="small" />}
												checkedIcon={<CheckBox fontSize="small" />}
												style={{ marginRight: 8 }}
												checked={selected}
											/>
											{option.permissionName}
											<Button
												onClick={() => setCreatePermission(true)}></Button>
										</li>
									)}
									style={{ width: 350 }}
									renderInput={params => (
										<TextField
											{...params}
											label="Permissions"
											placeholder="Add permission"
										/>
									)}
									onChange={handlePermissionChange}
								/>
								<Button
									color="secondary"
									variant="text"
									onClick={() => setCreatePermission(true)}>
									Add other permission
								</Button>

								<div className="flex justify-around mb-2 mt-10">
									<Button
										onClick={permissionHandleSubmit(AddPermission)}
										type="submit"
										color="success"
										variant="contained"
										size="medium"
										className="w-full">
										+ Add permission
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					{/* Create one permission */}
					<Dialog
						open={createPermission}
						onClose={() => setCreatePermission(false)}
						className="max-w-[500px] mx-auto">
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setCreatePermission(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<DialogContent>
							<form
								onSubmit={handleSubmit(createOnePermission)}
								className="text-xs">
								<div className="my-3">
									<div>
										<label className="font-semibold">Name:</label>
									</div>
									<Input
										autoFocus
										color="info"
										style={{ width: 350 }}
										{...register("name", {
											required: "Permission name is required.",
										})}
										placeholder="Enter permission name"
									/>
								</div>

								<span className="text-danger">{roleErrors.name?.message}</span>

								<div className="flex justify-around my-3">
									<Button
										color="success"
										variant="contained"
										size="medium"
										type="submit"
										className="w-full">
										+ Add New
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			)}
		</>
	);
}
