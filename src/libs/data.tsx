"use server";

import { ApiResponse } from "@/types/types";
import exp from "constants";
import { NextResponse } from "next/server";

export interface Employee {
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
	submitedInfo: string;
	historyLogs: [
		{
			id: number;
			packageId: number;
			step: number;
			historyNote: string;
			photos: string;
			createdAt: string;
			updatedAt: string;
			status: number;
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

// fetchData
export const deleteProduct = async (productId: number) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL_PRODUCT + `/Product/${productId}`,
		{
			method: "DELETE",
			next: {
				revalidate: 1,
			},
		}
	);
};
export const fetchEmployees = async () => {
	const res = await import("../app/api/employees/route");
	return (await res.GET()).json() as Promise<ApiResponse>;
};
export const fetchUpdateAsync = async (employeeId: number) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + `/Employee/${employeeId}/UpdateInfoAsync`,
		{
			method: "PUT",
			next: {
				revalidate: 1,
			},
		}
	);
};
export const fetchChangeStatus = async (employeeId: number) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + `/Employee/${employeeId}/ChangeStatus`,
		{
			method: "PUT",
			cache: "no-cache",
		}
	);
};
export const fetchPermissions = async () => {
	const res = await import("../app/api/permissions/route");
	return (await res.GET()).json() as Promise<ApiResponse>;
};
export const fetchAddPermission = async (
	roleId: number,
	permissionId: number
) => {
	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			`/Role/${roleId}/Permission/${permissionId}`,
		{
			method: "POST",
			next: {
				revalidate: 1,
			},
		}
	);
};
export const fetchBranches = async () => {
	const response = await import("../app/api/branchs/route");
	return (await response.GET()).json() as Promise<ApiResponse>;
};
export const fetchLocations = async () => {
	const res = await import("../app/api/locations/route");
	return (await res.GET()).json() as Promise<ApiResponse>;
};
export const fetchUpdatedRequests = async () => {
	const res = await import("../app/api/requests/route");
	return (await res.GET()).json() as Promise<ApiResponse>;
};
export const fetchProvinces = async () => {
	const res = await import("../app/api/provinces/route");
	return (await res.GET()).json() as Promise<ApiResponse>;
};
export const fetchRoles = async () => {
	const res = await import("../app/api/roles/route");
	return (await res.GET()).json() as Promise<ApiResponse>;
};
export const fetchRolesWithPermission = async () => {
	const res = await import("../app/api/roles/permissions/route");

	return (await res.GET()).json() as Promise<ApiResponse>;
};
