"use client";

import React from "react";
import Loading from "@/app/components/Loading";
import {
	AcceptEmployeeRequest,
	Employee,
	fetchUpdatedRequests,
} from "@/libs/data";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Tooltip,
} from "@mui/material";
import {
	DoneOutline,
	CloseOutlined,
	SkipNext,
	SkipPrevious,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/types";
import { toast } from "sonner";

export default function UpdatedRequestManagement() {
	const [employees, setEmployees] = React.useState<Employee[]>([]);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [isLoading, setIsLoading] = React.useState(true);
	const [selectAllChecked, setSelectAllChecked] = React.useState(false);
	const [openAcceptForm, setOpenAcceptForm] = React.useState(false);

	const {
		register,
		formState: { errors },
	} = useForm<AcceptEmployeeRequest>();

	// fetch data
	React.useEffect(() => {
		Promise.all([fetchUpdatedRequests()]).then(data => {
			const [employeeRes] = data;

			if (employeeRes.ok) {
				setEmployees(employeeRes.data);
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
			fetchUpdatedRequests().then(data => {
				if (data.ok) {
					setEmployees(data.data);
				}
			});
		} else {
			const filterEmployees = employees.filter(employee =>
				employee.fullname.toLowerCase().includes(name.toLowerCase())
			);

			setEmployees(filterEmployees);
		}
	}

	// Accept Updated Request
	async function AcceptRequest(employeeId: number) {
		try {
			const response = await fetch(`/api/requests/${employeeId}`, {
				method: "PUT",
			});

			const payload = (await response.json()) as ApiResponse;
			console.log("payload:" + payload);
			if (payload.ok) {
				//const res = await fetchUpdatedRequests();
				setEmployees(pre => pre.filter(emp => emp.id != employeeId));
				toast.success(payload.message);
			} else {
				toast.error(payload.message);
			}
		} catch (error) {
			console.log(error);
		}
	}
	// Reject Updated Request
	async function handleRejectRequest(requestId: number) {
		try {
			const res = await fetch(`/api/requests/${requestId}`, {
				method: "DELETE",
			});

			const payload = (await res.json()) as ApiResponse;

			if (payload.ok) {
				setEmployees(pre => pre.filter(emp => emp.id != requestId));
				toast.success(payload.message);
				setOpenAcceptForm(false);
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
					{/* Handle Search */}
					<div className="mx-2">
						<form
							onSubmit={handleSearch}
							method="post"
							className="flex justify-end items-center py-4 ">
							<input
								type="text"
								name="search"
								id="searchInput"
								className="mr-2 text-[14px] border-slate-400 max-w-[200px] h-[35px] cursor-pointer"
								placeholder="Enter name to search"
							/>
							<button className="btn btn-success">Search</button>
						</form>
					</div>
					{/* Display Employees has submitedInfo */}
					<table
						width="100%"
						className="">
						<thead className="text-white text-xs">
							<tr>
								<th>
									<Tooltip title="Check all">
										<input
											type="checkbox"
											className="ml-1"
											checked={selectAllChecked}
											onChange={handleSelectedAll}
										/>
									</Tooltip>
								</th>
								<th>#</th>
								<th>Fullname</th>
								<th>Email</th>
								<th>Phone number</th>
								<th>Branch</th>
								<th>Role</th>
								<th>Submited Info</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{currentEmployees.map(employee => {
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
										<td>{employee.roleName}</td>
										<td className="multiline-truncate">
											<Tooltip
												title={employee.submitedInfo.toString()}
												placement="bottom">
												<p>{employee.submitedInfo ? "YES" : ""}</p>
											</Tooltip>
										</td>

										<td>
											<Tooltip title="Accept">
												<Button
													variant="text"
													color="success"
													type="button"
													onClick={() => setOpenAcceptForm(true)}>
													<DoneOutline className="text-green-700 text-[20px] mr-2" />
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

					{/*  */}
					{currentEmployees.map(employee => {
						const infoString = employee.submitedInfo;
						const infoArray = infoString.split(", ");

						const extractedInfo: Record<string, string> = {};
						infoArray.forEach(pair => {
							const [key, value] = pair.split(":");
							extractedInfo[key.toLowerCase()] = value;
						});
						//console.log(extractedInfo);
						return (
							<Dialog
								key={employee.id}
								open={openAcceptForm}
								onClose={() => setOpenAcceptForm(false)}
								className="max-w-[500px] mx-auto">
								<Tooltip title="Close">
									<CloseOutlined
										onClick={() => setOpenAcceptForm(false)}
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
										onSubmit={() => AcceptRequest(employee.id)}
										className="text-xs">
										<div className="my-3">
											<label className="font-semibold">Email:</label>
											<input
												{...register("email")}
												className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												value={extractedInfo.email}
												readOnly
											/>
										</div>

										<div className="my-3">
											<label className="font-semibold">Phone number:</label>
											<input
												{...register("phonenumber")}
												className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												value={extractedInfo.phonenumber}
												readOnly
											/>
										</div>

										<div className="my-3">
											<label className="font-semibold">Address:</label>
											<textarea
												{...register("address")}
												className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												value={extractedInfo.address}
												readOnly></textarea>
										</div>
										{/* Select: district, province */}
										<div className="my-3 flex">
											<div className="mr-2">
												<label className="font-semibold">Province:</label>
												<input
													{...register("province")}
													className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
													name="province"
													id="province"
													value={extractedInfo.province}
													readOnly
												/>
											</div>

											<div>
												<label className="font-semibold">District:</label>
												<input
													{...register("district")}
													className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
													name="district"
													id="district"
													value={extractedInfo.district}
													readOnly
												/>
											</div>
										</div>

										<div className="my-3">
											<label className="font-semibold">Upload Avatar:</label>
											<input
												{...register("avatar")}
												className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
												value={extractedInfo.avatar}
												readOnly
											/>
										</div>

										<div className="flex justify-around mb-2 mt-10">
											<Button
												onClick={() => {
													AcceptRequest(employee.id);
												}}
												type="submit"
												className="w-full btn btn-success">
												Accept
											</Button>
											<Button
												onClick={() => handleRejectRequest(employee.id)}
												className="w-full btn btn-danger">
												Reject
											</Button>
										</div>
									</form>
								</DialogContent>
							</Dialog>
						);
					})}
				</div>
			)}
		</div>
	);
}
