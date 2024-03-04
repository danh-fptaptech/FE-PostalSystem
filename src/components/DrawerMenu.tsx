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
import { useSession } from "next-auth/react";

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

		createMenu("Profile", AccountBoxOutlined, "/app/user", ["user.view"]),
		createMenu(
			"Change Password",
			PasswordOutlined,
			"/app/user/change-password",
			["password.change"]
		),
		createMenu("Packages", Inventory2Outlined, "/app/user/packages", [
			"packages.view",
		]),
		createMenu("Create Package", NoteAddOutlined, "/app/user/create-package", [
			"package.create",
		]),
		createMenu("Add Address", NoteAddOutlined, "/app/user/add-address", [
			"address.create",
		]),
		createMenu("Addresses", NoteAddOutlined, "/app/user/addresses", [
			"addresses.view",
		]),
	];

	return (
		<div>
			<Toolbar></Toolbar>
			<Divider />
			<List>
				{menu.map((item, index) => (
					<MenuGroup
						item={item}
						key={index}
					></MenuGroup>
				))}
			</List>
		</div>
	);
}
