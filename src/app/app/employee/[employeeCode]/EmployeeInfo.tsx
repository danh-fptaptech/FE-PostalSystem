"use client";

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { getChildrenLocationsByParentId, getProvinces } from "@/app/_data/data";
import React from "react";
import {
	ApiResponse,
	Employee,
	Province,
	UpdateInfoRequest,
} from "@/types/types";
import { toast } from "sonner";
import { CloseOutlined, Send } from "@mui/icons-material";
import {
	Dialog,
	Tooltip,
	DialogTitle,
	DialogContent,
	Button,
	Avatar,
	InputLabel,
	Typography,
	Box,
} from "@mui/material";
import Loading from "@/components/Loading";

export default function EmployeeInfoPage() {
	const [employee, setEmployee] = React.useState<Employee>();
	const [loading, setLoading] = React.useState(true);
	const [provinces, setProvinces] = React.useState<Province[]>([]);
	const [districts, setDistricts] = React.useState<Province[]>([]);
	const [openDialogUpdatedResquest, setOpenDialogUpdatedResquest] =
		React.useState(false);

	const { data: session } = useSession();
	const {
		register: updatedRegister,
		handleSubmit: handleUpdatedSubmit,
		formState: { errors: updatedErrors },
		setValue,
		watch,
	} = useForm<UpdateInfoRequest>();
	const province = watch("province");

	// handle send updated  request
	async function SendUpdatedRequest(data: UpdateInfoRequest) {
		const loadingId = toast.loading("Loading ...");
		try {
			const response = await fetch(
				`/api/employees/${session?.user.employeeCode}/sendUpdatedRequest`,
				{
					method: "PUT",
					body: JSON.stringify(data),
				}
			);

			const payload = (await response.json()) as ApiResponse;

			if (payload.ok) {
				setOpenDialogUpdatedResquest(false);
				toast.success(payload.message);
			} else {
				toast.error(payload.message);
			}
		} catch (error) {
			console.log("error send updated requset: ", error);
		}

		toast.dismiss(loadingId);
	}

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

	React.useEffect(() => {
		const fetchData = () => {
			Promise.all([
				fetch(`/api/employees/${session?.user.employeeCode}`),
				getProvinces(),
				,
			]).then(res => {
				const [empRes, provinceRes] = res;
				empRes.json().then(payload => {
					if (payload.ok) {
						setEmployee(payload.data);
					}
				});

				if (provinceRes.ok) {
					setProvinces(provinceRes.data);
				}

				setLoading(false);
			});
		};

		fetchData();
	}, [session?.user.employeeCode]);
	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<Box className="my-4">
					<Box className="mx-3">
						<Box className="flex items-center my-3">
							<Avatar
								variant="rounded"
								src={employee?.avatar}
								alt={employee?.fullname}
								className="mr-2"
							/>
							<Typography className="font-semibold">
								{employee?.employeeCode}
							</Typography>
						</Box>

						<Box className="flex items-center justify-between my-3">
							<Box className="flex items-center">
								<InputLabel className="mr-2">Full name:</InputLabel>
								<Typography className="text-sm uppercase">
									{employee?.fullname}
								</Typography>
							</Box>

							<Box className="flex items-center">
								<InputLabel className="mr-2">Email:</InputLabel>
								<Typography className="text-sm">{employee?.email}</Typography>
							</Box>

							<Box className="flex items-center">
								<InputLabel className="mr-2">Phone number:</InputLabel>
								<Typography className="text-sm">
									{employee?.phoneNumber}
								</Typography>
							</Box>
						</Box>

						<Box className="flex justify-between items-center my-3">
							<Box className="flex items-center">
								<InputLabel className="mr-2">Branch:</InputLabel>
								<Typography className="text-sm">
									{employee?.branchName}
								</Typography>
							</Box>

							<Box className="flex items-center">
								<InputLabel className="mr-2">Address:</InputLabel>
								<Typography className="text-sm">
									{employee?.address}, {employee?.district},{" "}
									{employee?.province}.
								</Typography>
							</Box>

							<Box className="flex items-center">
								<InputLabel className="mr-2">Role:</InputLabel>
								<Typography className="text-sm">
									{employee?.roleName}
								</Typography>
							</Box>
						</Box>

						<Button
							className="my-3"
							variant="contained"
							color="secondary"
							onClick={() => setOpenDialogUpdatedResquest(true)}>
							Update Information
						</Button>
					</Box>

					{/* Dialog send updated info */}
					<Dialog
						open={openDialogUpdatedResquest}
						className="max-w-[500px] mx-auto">
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setOpenDialogUpdatedResquest(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<div className="flex justify-center my-3">
							<DialogTitle className="text-center">
								Updated Employee Request
							</DialogTitle>
						</div>

						<DialogContent>
							<form
								onSubmit={handleUpdatedSubmit(SendUpdatedRequest)}
								className="text-xs">
								<div className="my-3">
									<label className="font-semibold">EmployeeCode:</label>
									<input
										readOnly
										disabled
										defaultValue={employee?.employeeCode}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<div className="my-3">
									<label className="font-semibold">Fullname:</label>
									<input
										readOnly
										disabled
										defaultValue={employee?.fullname}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<div className="my-3">
									<label className="font-semibold">Email:</label>
									<input
										readOnly
										disabled
										defaultValue={employee?.email}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<div className="my-3">
									<label className="font-semibold">Phone number:</label>
									<input
										defaultValue={employee?.phoneNumber}
										{...updatedRegister("phonenumber", {
											required: "Phone number is required.",
											pattern: {
												value: /^\d{10}$/,
												message: "Phone number must have 10 digits.",
											},
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<div className="my-3">
									<label className="font-semibold">Address:</label>
									<textarea
										defaultValue={employee?.address}
										{...updatedRegister("address", {
											required: "Address is required.",
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"></textarea>
								</div>

								<div className="my-3 flex">
									<div className="mr-2">
										<label className="font-semibold">Province:</label>
										<select
											{...updatedRegister("province")}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											id="province">
											<option value="">Select province</option>
											{provinces.map(province => (
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
											id="district"
											disabled={districts.length === 0}>
											<option value="">Select district</option>
											{districts.map(district => (
												<option
													key={district.id}
													value={district.locationName}>
													{district.locationName}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="my-3 flex">
									<div className="mr-2">
										<label className="font-semibold">Branch:</label>
										<input
											readOnly
											disabled
											defaultValue={employee?.branchName}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										/>
									</div>

									<div>
										<label className="font-semibold">Role:</label>
										<input
											readOnly
											disabled
											defaultValue={employee?.roleName}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										/>
									</div>
								</div>

								<div className="my-3">
									<label className="font-semibold">Upload New Avatar:</label>
									<input
										{...updatedRegister("avatar")}
										defaultValue={employee?.avatar}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<Button
									startIcon={<Send fontSize="small" />}
									type="submit"
									color="success"
									variant="contained"
									className="w-full mr-2">
									Send
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</Box>
			)}
		</>
	);
}
