export interface ApiResponse {
	json(): unknown;
	ok: boolean;
	status: string;
	message: string;
	data?: any;
}

export interface EmployeeProps {
	params: {
		employeeCode: string;
	};
}
