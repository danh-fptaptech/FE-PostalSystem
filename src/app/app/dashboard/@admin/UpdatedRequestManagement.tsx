"use client";

import {
	AcceptEmployeeRequest,
	fetchUpdatedRequests,
	Employee,
} from "@/libs/data";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
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
import { ApiResponse } from "@/types/types";
import { toast } from "sonner";
import React from "react";

export default function UpdatedRequestManagement() {
	const [employees, setEmployees] = React.useState<AcceptEmployeeRequest[]>([]);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [isLoading, setIsLoading] = React.useState(true);
	const [selectAllChecked, setSelectAllChecked] = React.useState(false);
	const [selectedEmployee, setSelectedEmployee] =
		React.useState<AcceptEmployeeRequest | null>(null);

	// fetch data
	React.useEffect(() => {
		Promise.all([fetchUpdatedRequests()]).then(data => {
			const [employeeRes] = data;

			if (employeeRes.ok) {
				const employees = employeeRes.data as Employee[];
				const newEmployees = employees.map(employee => {
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
					acceptEmployee.submitedInfo = extractedInfo;

					return acceptEmployee;
				});
				setEmployees(newEmployees);
			}
			setIsLoading(false);
		});
	}, []);

	// Handle Pagination
	const PAGE_SIZE = 10;
	const totalPages = Math.ceil(employees.length / PAGE_SIZE);
	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const endIndex = startIndex + PAGE_SIZE;
	const currentEmployees = employees.slice(startIndex, endIndex);
	function handlePageChange(selectedPage: number) {
		setCurrentPage(selectedPage);
	}

	// Accept Updated Request
	async function AcceptRequest(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (selectedEmployee) {
			try {
				const response = await fetch(`/api/requests/${selectedEmployee.id}`, {
					method: "PUT",
					body: JSON.stringify(selectedEmployee),
				});

				const payload = (await response.json()) as ApiResponse;
				console.log("payload:" + payload);
				if (payload.ok) {
					//const res = await fetchUpdatedRequests();
					setEmployees(pre => pre.filter(emp => emp.id != selectedEmployee.id));
					setSelectedEmployee(null);
					toast.success(payload.message);
				} else {
					toast.error(payload.message);
				}
			} catch (error) {
				console.log(error);
			}
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
		<div className="w-full">
			{isLoading ? (
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
								))}
							</TableBody>
						</Table>
					</TableContainer>

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
									{/* Select: district, province */}
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
		</div>
	);
}
