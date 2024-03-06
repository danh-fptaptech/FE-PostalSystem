"use client";

import { fetchUpdatedRequests } from "@/app/_data/index";
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
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
	DoneOutline,
	CloseOutlined,
	SkipNext,
	SkipPrevious,
} from "@mui/icons-material";
import Loading from "@/app/components/Loading";
import { ApiResponse, AcceptEmployeeRequest, Employee } from "@/types/types";
import { toast } from "sonner";
import React from "react";
import page from "../employees/page";

export default function UpdatedRequestManagement() {
	const [employees, setEmployees] = React.useState<AcceptEmployeeRequest[]>([]);
	const [loading, seLoading] = React.useState(true);
	const [selectedEmployee, setSelectedEmployee] =
		React.useState<AcceptEmployeeRequest | null>(null);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
		Promise.all([fetchUpdatedRequests()]).then(data => {
			const [employeeRes] = data;

			if (employeeRes.ok) {
				const employees = employeeRes.data as Employee[];
				const newEmployees = employees.map(employee => {

					//@ts-ignore
					const acceptEmployee: AcceptEmployeeRequest = {
						...employee,
					};
					const infoString = employee.submitedInfo;
					const infoArray = infoString.split(", ");

					const extractedInfo: Record<string, string> = {};
					infoArray.forEach(pair => {
						const [key, value] = pair.split(":");
						extractedInfo[key.toLowerCase()] = value;
					});

					//@ts-ignore
					acceptEmployee.submitedInfo = extractedInfo;

					return acceptEmployee;
				});
				setEmployees(newEmployees);
			}
			seLoading(false);
		});
	}, []);

	// Accept Updated Request
	async function AcceptRequest(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (selectedEmployee) {
			const loadingId = toast.loading("Loading ... ");
			try {
				const response = await fetch(`/api/requests/${selectedEmployee.id}`, {
					method: "PUT",
					body: JSON.stringify(selectedEmployee),
				});

				const payload = (await response.json()) as ApiResponse;

				if (payload.ok) {
					setEmployees(pre => pre.filter(emp => emp.id != selectedEmployee.id));
					setSelectedEmployee(null);
					toast.success(payload.message);
				} else {
					toast.error(payload.message);
				}
			} catch (error) {
				console.log(error);
			}
			toast.dismiss(loadingId);
		}
	}
	// Reject Updated Request
	async function handleRejectRequest() {
		if (selectedEmployee) {
			try {
				const res = await fetch(`/api/requests/${selectedEmployee.id}`, {
					method: "DELETE",
				});

				const payload = (await res.json()) as ApiResponse;

				if (payload.ok) {
					setEmployees(pre => pre.filter(emp => emp.id != selectedEmployee.id));
					toast.success(payload.message);
					setSelectedEmployee(null);
				} else {
					toast.error(payload.message);
				}
			} catch (error) {
				console.log(error);
			}
		}
	}

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
										Employee Code
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
										Action
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{employees.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={7}
											align="center"
											className="text-sm">
											No Request
										</TableCell>
									</TableRow>
								)}
								{employees
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map(employee => {
										return (
											<TableRow
												key={employee.id}
												sx={{
													"&:last-child td, &:last-child th": { border: 0 },
												}}>
												<TableCell align="center">
													{employee.employeeCode}
												</TableCell>
												<TableCell align="center">
													{employee.fullname}
												</TableCell>
												<TableCell align="center">{employee.email}</TableCell>
												<TableCell align="center">
													{employee.phoneNumber}
												</TableCell>
												<TableCell align="center">
													{employee.branchName}
												</TableCell>
												<TableCell align="center">
													{employee.roleName}
												</TableCell>
												<TableCell align="center">
													<Tooltip title="Accept">
														<Button
															variant="text"
															color="success"
															type="button"
															onClick={() => {
																setSelectedEmployee(employee);
															}}>
															<DoneOutline className="text-green-700 text-[20px] mr-2" />
														</Button>
													</Tooltip>
												</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
						<TablePagination
							component="div"
							count={employees.length || 0}
							page={page}
							onPageChange={handleChangePage}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>

					{selectedEmployee && (
						<Dialog
							open
							className="max-w-[500px] mx-auto">
							<Tooltip title="Close">
								<CloseOutlined
									onClick={() => setSelectedEmployee(null)}
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
									onSubmit={e => AcceptRequest(e)}
									className="text-xs">
									<div className="my-3">
										<label className="font-semibold">Email:</label>
										<input
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={selectedEmployee?.submitedInfo.email}
											readOnly
										/>
									</div>

									<div className="my-3">
										<label className="font-semibold">Phone number:</label>
										<input
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={selectedEmployee?.submitedInfo.phonenumber}
											readOnly
										/>
									</div>

									<div className="my-3">
										<label className="font-semibold">Postal Code:</label>
										<input
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={selectedEmployee?.submitedInfo.postalcode}
											readOnly
										/>
									</div>

									<div className="my-3">
										<label className="font-semibold">Address:</label>
										<textarea
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={selectedEmployee?.submitedInfo.address}
											readOnly></textarea>
									</div>

									<div className="my-3 flex">
										<div className="mr-2">
											<label className="font-semibold">Province:</label>
											<input
												className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												name="province"
												id="province"
												value={selectedEmployee?.submitedInfo.province}
												readOnly
											/>
										</div>

										<div>
											<label className="font-semibold">District:</label>
											<input
												className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												name="district"
												id="district"
												value={selectedEmployee?.submitedInfo.district}
												readOnly
											/>
										</div>
									</div>

									<div className="my-3">
										<label className="font-semibold">Upload Avatar:</label>
										<input
											className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											value={selectedEmployee?.submitedInfo.avatar}
											readOnly
										/>
									</div>

									<div className="flex justify-around mb-2 mt-10">
										<Button
											type="submit"
											color="success"
											variant="contained"
											size="small"
											className="w-full mr-2">
											Accept
										</Button>
										<Button
											color="error"
											variant="contained"
											size="small"
											onClick={() => handleRejectRequest()}
											className="w-full">
											Reject
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					)}
				</div>
			)}
		</>
	);
}
