"use client";

import { useSession } from "next-auth/react";
import {
	CloseOutlined,
	EditOutlined,
	Visibility,
	VisibilityOff,
	Send,
} from "@mui/icons-material";
import {
	Employee,
	UpdateInfoRequest,
	fetchLocations,
	Location,
} from "@/libs/data";
import { ApiResponse, EmployeeProps } from "@/types/types";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Tooltip,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
	.object({
		oldPassword: z
			.string({
				required_error: "Old password is required!",
			})
			.min(3, "Old password must be at least 3 characters!")
			.max(50),
		newPassword: z
			.string({
				required_error: "New password is required!",
			})
			.min(3, "New password must be at least 3 characters!")
			.max(50),
		confirmPassword: z.string({
			required_error: "Confirm password is required!",
		}),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"], // path of error
	})
	.refine(data => data.oldPassword !== data.newPassword, {
		message: "New password must be different from old password",
		path: ["newPassword"],
	});

type Schema = z.infer<typeof schema>;

export default function EmployeeInfo() {
	const [locations, setLocations] = React.useState<Location[]>([]);
	const [employee, setEmployee] = React.useState<Employee>();
	const [showPassword, setShowPassword] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	const [openDialog, setOpenDiolog] = React.useState(false);
	const [openDialogUpdatedResquest, setOpenDialogUpdatedResquest] =
		React.useState(false);

	const { data: session } = useSession();

	const {
		register: updatedRegister,
		handleSubmit: handleUpdatedSubmit,
		formState: { errors: updatedErrors },
	} = useForm<UpdateInfoRequest>();
	const {
		register: passwordRegiter,
		handleSubmit: handlePasswordSubmit,
		formState: { errors: passwordErrors },
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	async function ChangePassword(data: Schema) {
		try {
			const response = await fetch(
				`/api/employees/${session?.user.employeeCode}/changePassword`,
				{
					method: "PUT",
					body: JSON.stringify(data),
				}
			);

			const payload = (await response.json()) as ApiResponse;
			console.log("payload:" + payload.ok);

			if (payload.ok) {
				setEmployee(payload.data);
				setOpenDiolog(false);
				toast.success(payload.message);
			} else {
				toast.error(payload.message);
			}
		} catch (error) {
			console.log("Error change password: ", error);
		}
	}

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

	const handleMouseEvents = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

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
		<div>
			{isLoading ? (
				<Loading />
			) : (
				<div>
					<p>{employee?.employeeCode}</p>

					<Button
						startIcon={<EditOutlined fontSize="small" />}
						color="info"
						variant="contained"
						onClick={() => setOpenDialogUpdatedResquest(true)}>
						Update
					</Button>
				</div>
			)}

			{/* Dialog change password */}
			<Dialog
				open={openDialog}
				className="max-w-[500px] mx-auto">
				<Tooltip title="Close">
					<CloseOutlined
						onClick={() => setOpenDiolog(false)}
						color="error"
						className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
					/>
				</Tooltip>

				<div className="my-3">
					<DialogTitle className="text-center">Change Password</DialogTitle>
				</div>

				<DialogContent>
					<form
						onSubmit={handlePasswordSubmit(ChangePassword)}
						className="text-xs">
						<div className="my-3">
							<label className="font-semibold">Current password:</label>
							<FormControl
								fullWidth
								size="small"
								variant="outlined"
								margin="normal"
								error={!!passwordErrors.oldPassword}>
								<InputLabel htmlFor="password">Password</InputLabel>
								<OutlinedInput
									label="Password"
									id="password"
									autoComplete="current-password"
									type={showPassword ? "text" : "password"}
									{...passwordRegiter("oldPassword", {
										setValueAs: v => (v === "" ? undefined : v),
									})}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={() => setShowPassword(!showPassword)}
												onMouseDown={handleMouseEvents}
												onMouseUp={handleMouseEvents}
												edge="end">
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
								/>
								<FormHelperText>
									{passwordErrors.oldPassword?.message}
								</FormHelperText>
							</FormControl>
						</div>

						<div className="my-3">
							<label className="font-semibold">New password:</label>
							<FormControl
								fullWidth
								size="small"
								variant="outlined"
								margin="normal"
								error={!!passwordErrors.newPassword}>
								<InputLabel htmlFor="New password">New password</InputLabel>
								<OutlinedInput
									label="New password"
									id="New password"
									autoComplete="new-password"
									type={showPassword ? "text" : "password"}
									{...passwordRegiter("newPassword", {
										setValueAs: v => (v === "" ? undefined : v),
									})}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={() => setShowPassword(!showPassword)}
												onMouseDown={handleMouseEvents}
												onMouseUp={handleMouseEvents}
												edge="end">
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
								/>
								<FormHelperText>
									{passwordErrors.newPassword?.message}
								</FormHelperText>
							</FormControl>
						</div>

						<div className="my-3">
							<label className="font-semibold">Confirm password:</label>
							<FormControl
								fullWidth
								size="small"
								variant="outlined"
								margin="normal"
								error={!!passwordErrors.confirmPassword}>
								<InputLabel htmlFor="confirmPassword">
									Confirm password
								</InputLabel>
								<OutlinedInput
									label="Confirm password"
									id="confirmPassword"
									autoComplete="new-password"
									type={showPassword ? "text" : "password"}
									{...passwordRegiter("confirmPassword", {
										setValueAs: v => (v === "" ? undefined : v),
									})}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={() => setShowPassword(!showPassword)}
												onMouseDown={handleMouseEvents}
												onMouseUp={handleMouseEvents}
												edge="end">
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
								/>
								<FormHelperText>
									{passwordErrors.confirmPassword?.message}
								</FormHelperText>
							</FormControl>
						</div>

						<div className="flex justify-around mb-2 mt-10">
							<Button
								variant="contained"
								color="success"
								type="submit"
								className="w-full mr-2">
								Change
							</Button>
							<Button
								variant="contained"
								color="primary"
								type="reset"
								className="w-full">
								Cancel
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

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

						<div className="flex justify-around mb-2 mt-10">
							<Button
								startIcon={<Send fontSize="small" />}
								type="submit"
								color="success"
								variant="contained"
								className="w-full mr-2">
								Send
							</Button>
							<Button
								color="info"
								variant="contained"
								className="w-full"
								onClick={() => setOpenDiolog(true)}>
								Change Password
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
