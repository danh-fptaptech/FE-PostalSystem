"use client";

import { Employee } from "@/libs/data";
import { DriveFileRenameOutline } from "@mui/icons-material";
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Tooltip,
	Button,
} from "@mui/material";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import React from "react";

export default function HistoryLogsPage() {
	const [employee, setEmployee] = React.useState<Employee | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = React.useState(true);
	const { data: session } = useSession();

	React.useEffect(() => {
		const fetchData = () => {
			fetch(`/api/employees/${session?.user.employeeCode}`)
				.then(res => {
					res.json().then(payload => {
						if (payload.ok) {
							setEmployee(payload.data);
						} else {
							console.error("Failed to get employee!");
						}
					});

					setIsLoading(false);
				})
				.catch(error => {
					console.error("Error fetching employee:", error);
					setIsLoading(false);
				});
		};

		if (session?.user.employeeCode) {
			fetchData();
		} else {
			setIsLoading(false);
		}
	}, [session?.user.employeeCode]);

	return (
		<div>
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
										PackageId
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Package Photo
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Note
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Step
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Updated Date
									</TableCell>
									<TableCell
										align="center"
										className="text-white text-sm">
										Action
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{employee?.historyLogs?.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											align="center"
											className="text-sm">
											No History Log
										</TableCell>
									</TableRow>
								) : (
									employee?.historyLogs?.map(h => (
										<TableRow
											key={h.id}
											sx={{
												"&:last-child td, &:last-child th": { border: 0 },
											}}>
											<TableCell align="center">{h.packageId}</TableCell>
											<TableCell align="center">{h.photos}</TableCell>
											<TableCell align="center">{h.historyNote}</TableCell>
											<TableCell align="center">{h.step}</TableCell>
											<TableCell align="center">{h.updatedAt}</TableCell>
											<TableCell align="center">
												<Tooltip title="Change Step">
													<Button
														type="button"
														endIcon={
															<DriveFileRenameOutline fontSize="medium" />
														}
														variant="text"
														color="success"
														onClick={() => {
															setEmployee(employee);
															//setOpenUpdateForm(true);
														}}></Button>
												</Tooltip>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			)}
		</div>
	);
}
