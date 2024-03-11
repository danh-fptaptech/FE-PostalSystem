"use client";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import {
	AppsOutlined,
	DomainAddOutlined,
	DomainOutlined,
	HomeWorkOutlined,
	Inventory2Outlined,
	NoteAddOutlined,
	AccountBoxOutlined,
	PasswordOutlined,
	GroupOutlined,
	BadgeOutlined,
	DriveFileRenameOutlineOutlined,
	ManageAccountsOutlined,
	BusinessOutlined,
	OutboxOutlined,
	MoveToInboxOutlined,
	ViewListOutlined,
} from "@mui/icons-material";
import * as React from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { usePathname } from "next/navigation";
import MenuGroup from "@/components/MenuGroup";
import PermissionCheck from "./PermissionCheck";

// @ts-ignore
function createMenu(
	name: string,
	icon: OverridableComponent<any>,
	path: string,
	permission: string,

	children?: any[{
		name: string;
		icon: OverridableComponent<any>;
		path: string;
		permission: string;
	}]
) {
	return { name, icon, path, permission, children };
}

export default function DrawerMenu() {
	const path = usePathname();

	const menu = [
		createMenu("Dashboard", AppsOutlined, "/app", "app.view"),
		createMenu(
			"Create Package",
			NoteAddOutlined,
			"/app/create-package",
			"package.create"
		),
		createMenu("Packages", Inventory2Outlined, "/app/packages", "package.view"),
		createMenu("User Management", GroupOutlined, "/app/admin/users", "user"),
		createMenu("Branches", HomeWorkOutlined, "/app/branches", "branch", [
			createMenu(
				"List Branches",
				DomainOutlined,
				"/app/branches",
				"branch.view"
			),
			createMenu(
				"Create Branch",
				DomainAddOutlined,
				"/app/branches/create",
				"branch.create"
			),
		]),

		createMenu("Employee Management", BadgeOutlined, "/app/admin", "admin", [
			createMenu(
				"List Employees",
				GroupOutlined,
				"/app/admin/employees",
				"admin.employee"
			),
			createMenu(
				"Updated Requests",
				DriveFileRenameOutlineOutlined,
				"/app/admin/requests",
				"admin.request"
			),
			createMenu(
				"Role Management",
				ManageAccountsOutlined,
				"/app/admin/roles",
				"admin.role"
			),
		]),
		createMenu("Profile", AccountBoxOutlined, "/app/user", "user.view"),
		createMenu(
			"Change Password",
			PasswordOutlined,
			"/app/user/change-password",
			"password.change"
		),
		createMenu(
			"Packages",
			Inventory2Outlined,
			"/app/user/packages",
			"packages.view"
		),
		createMenu(
			"Create Package",
			NoteAddOutlined,
			"/app/user/create-package",
			"package.create"
		),
		createMenu(
			"Addresses",
			BusinessOutlined,
			"/app/user/addresses",
			"addresses.view",
			[
				createMenu(
					"Sender",
					OutboxOutlined,
					"/app/user/addresses/sender",
					"addresses.view"
				),
				createMenu(
					"Receiver",
					MoveToInboxOutlined,
					"/app/user/addresses/receiver",
					"addresses.view"
				),
				createMenu(
					"Add Address",
					DomainAddOutlined,
					"/app/user/add-address",
					"address.create"
				),
			]
		),
	];

	return (
		<div>
			<Toolbar></Toolbar>
			<Divider />
			<List>
				{menu.map((item, index) => (
					<PermissionCheck
						permission={item.permission}
						key={index}
					>
						<MenuGroup item={item}></MenuGroup>
					</PermissionCheck>
				))}
			</List>
		</div>
	);
}
