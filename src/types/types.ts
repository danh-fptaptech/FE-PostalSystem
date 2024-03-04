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

export interface Province {
	id: number;
	locationName: string;
	postalCode: string;
}

export interface Employee {
	id: number;
	employeeCode: string;
	fullname: string;
	avatar: string;
	email: string;
	password: string;
	phoneNumber: string;
	postalCode: string;
	address: string;
	province: string;
	district: string;
	roleName: string;
	roleId: number;
	branchName: string;
	branchId: number;
	status: number;
	submitedInfo: string;
	historyLogs: [
		{
			id: number;
			packageId: number;
			photos: string[];
			historyNote: string;
			step: number;
			prcessStep: number[];
			updatedAt: string;
		}
	];
}
export interface Branch {
	id: number;
	branchName: string;
}
export interface Role {
	id: number;
	name: string;
	roleHasPermissions: string[];
	status: number;
}
export interface Permission {
	id: number;
	permissionName: string;
}
export interface Location {
	id: number;
	locationName: string;
	postalCode: string;
	locationLevel: number;
	locationOf: number;
	parentLocation: string;
}
export interface CreateEmployeeRequest {
	employeeCode: string;
	fullname: string;
	avatar: string;
	email: string;
	password: string;
	phoneNumber: string;
	postalCode: string;
	address: string;
	province: string;
	district: string;
	branchId: number;
	roleId: number;
}
export interface CreatePermissionRequest {
	permissionNames: string[];
}
export interface CreateRoleRequest {
	name: string;
}
export interface CreatePermission {
	name: string;
}
export interface UpdateEmployeeRequest {
	branchId: number;
	roleId: number;
}
export interface UpdateInfoRequest {
	email: string;
	phonenumber: string;
	postalcode: string;
	address: string;
	province: string;
	district: string;
	avatar: string;
}
export interface UpdatePasswordRequest {
	password: string;
}
export interface AcceptEmployeeRequest {
	id: number;
	employeeCode: string;
	fullname: string;
	avatar: string;
	email: string;
	password: string;
	phoneNumber: string;
	address: string;
	province: string;
	district: string;
	roleName: string;
	roleId: number;
	branchName: string;
	branchId: number;
	status: number;
	submitedInfo: {
		avatar: string;
		email: string;
		phonenumber: string;
		postalcode: string;
		address: string;
		province: string;
		district: string;
	};
}
