"use client";

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
	Employee,
	Location,
	UpdateInfoRequest,
	fetchLocations,
} from "@/libs/data";
import React from "react";
import { ApiResponse } from "@/types/types";
import { toast } from "sonner";
import { CloseOutlined, Send } from "@mui/icons-material";
import {
	Dialog,
	Tooltip,
	DialogTitle,
	DialogContent,
	Button,
	TextField,
	Avatar,
} from "@mui/material";
import Loading from "@/components/Loading";

export default function EmployeeInfoPage() {
	const [employee, setEmployee] = React.useState<Employee>();
	const [locations, setLocations] = React.useState<Location[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [openDialogUpdatedResquest, setOpenDialogUpdatedResquest] =
		React.useState(false);

	const { data: session } = useSession();
	const {
		register: updatedRegister,
		handleSubmit: handleUpdatedSubmit,
		formState: { errors: updatedErrors },
	} = useForm<UpdateInfoRequest>();

	// handle send updated  request
	async function SendUpdatedRequest(data: UpdateInfoRequest) {
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
	}

	React.useEffect(() => {
		const fetchData = () => {
			Promise.all([
				fetch(`/api/employees/${session?.user.employeeCode}`),
				fetchLocations(),
			]).then(res => {
				const [empRes, locRes] = res;
				empRes.json().then(payload => {
					if (payload.ok) {
						setEmployee(payload.data);
					} else {
						console.error("Failed to get employee !");
					}
				});

				if (locRes.ok) {
					setLocations(locRes.data);
				}

				setIsLoading(false);
			});
		};

		fetchData();
	}, [session?.user.employeeCode]);
	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className="mt-4">
					<div className="flex items-center">
						<Avatar
							variant="rounded"
							src={employee?.avatar}
							alt={employee?.fullname}
							className="mr-2"
						/>
						<h3>{employee?.employeeCode}</h3>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<label className="mr-2">Full name:</label>
							<p className="text-sm font-semibold uppercase">
								{employee?.fullname}
							</p>
						</div>

						<div className="flex items-center">
							<label className="mr-2">Email:</label>
							<p className="text-sm font-semibold ">{employee?.email}</p>
						</div>

						<div className="flex items-center">
							<label className="mr-2">Phone number:</label>
							<p className="text-sm font-semibold ">{employee?.phoneNumber}</p>
						</div>
					</div>

					<div className="flex justify-between items-center">
						<div className="flex items-center">
							<label className="mr-2">Branch:</label>
							<p className="text-sm font-semibold">{employee?.branchName}</p>
						</div>

						<div className="flex items-center">
							<label className="mr-2">Address:</label>
							<p className="text-sm font-semibold ">
								{employee?.address}, {employee?.district}, {employee?.province}.
							</p>
						</div>

						<div className="flex items-center">
							<label className="mr-2">Postal Code:</label>
							<p className="text-sm font-semibold">
								{employee?.postalCode ? employee?.postalCode : "... updating"}
							</p>
						</div>
					</div>

					<Button
						className="my-3"
						variant="contained"
						color="secondary"
						onClick={() => setOpenDialogUpdatedResquest(true)}>
						Update Information
					</Button>

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

						<div className="my-3">
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
										{...updatedRegister("email", {
											required: "Email is required.",
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: "Invalid email address format.",
											},
										})}
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
											id="province"
											defaultValue={employee?.province}>
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
											id="district"
											defaultValue={employee?.district}>
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
									<label className="font-semibold">Upload Avatar:</label>
									<input
										defaultValue={employee?.avatar}
										{...updatedRegister("avatar")}
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
				</div>
			)}
		</>
	);
}
