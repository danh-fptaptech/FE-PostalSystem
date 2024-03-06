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
	BadgeOutlined,
	ManageAccountsOutlined,
	DriveFileRenameOutlineOutlined,
	GroupOutlined,
	ViewListOutlined,
} from "@mui/icons-material";
import * as React from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { usePathname } from "next/navigation";
import MenuGroup from "@/components/MenuGroup";

export default function DrawerMenu() {
	const path = usePathname();

	// @ts-ignore
	function createMenu(
		name: string,
		icon: OverridableComponent<any>,
		path: string,
		permission: [string],
		children?: any[{
			name: string;
			icon: OverridableComponent<any>;
			path: string;
			permission: [string];
		}]
	) {
		return { name, icon, path, permission, children };
	}

	const menu = [
		createMenu("Dashboard", AppsOutlined, "/app", ["app.view"]),

		createMenu("Create Package", NoteAddOutlined, "/app/create-package", [
			"package.create",
		]),

		createMenu(
			"Branches",
			HomeWorkOutlined,
			"/app/branches",
			["branch"],
			[
				createMenu("List Branches", DomainOutlined, "/app/branches", [
					"branch.view",
				]),
				createMenu("Create Branch", DomainAddOutlined, "/app/branches/create", [
					"branch.create",
				]),
			]
		),
		createMenu("Packages", Inventory2Outlined, "/app/packages", [
			"package.view",
		]),

		createMenu("User Management", GroupOutlined, "/app/admin/users", [
			"users.view",
		]),

		createMenu(
			"Employee Management",
			BadgeOutlined,
			"/app/admin",
			["admin"],
			[
				createMenu("List Employees", GroupOutlined, "/app/admin/employees", [
					"admin.view, admin.create, admin.update",
				]),
				createMenu(
					"Updated Requests",
					DriveFileRenameOutlineOutlined,
					"/app/admin/requests",
					["admin.update"]
				),
				createMenu(
					"Role Management",
					ManageAccountsOutlined,
					"/app/admin/roles",
					["admin.create, admin.update, admin.delete"]
				),
			]
		),

		createMenu("HistoryLogs", ViewListOutlined, "/app/historylogs", [
			"historylog.view",
		]),
	];

	return (
		<>
			<Toolbar></Toolbar>
			<Divider />
			<List>
				{menu.map((item, index) => (
					<MenuGroup
						item={item}
						key={index}></MenuGroup>
				))}
			</List>
		</>
	);
}
