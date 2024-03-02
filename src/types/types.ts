export interface ApiResponse {
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
