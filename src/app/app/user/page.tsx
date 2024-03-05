"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PasswordIcon from "@mui/icons-material/Password";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { UserContext } from "@/contexts/UserContext";

export default function UserDashboardListPage() {
	const userContext = React.useContext(UserContext);

	return (
		<Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
			<nav aria-label="">
				<List>
					<ListItem
						disablePadding
						onClick={() => userContext?.setSelectedTab("tab1")}
					>
						<ListItemButton sx={{ height: 56 }}>
							<ListItemIcon>
								<AccountCircleIcon />
							</ListItemIcon>
							<ListItemText primary="Profile" />
						</ListItemButton>
					</ListItem>
					<ListItem
						disablePadding
						onClick={() => userContext?.setSelectedTab("tab2")}
					>
						<ListItemButton sx={{ height: 56 }}>
							<ListItemIcon>
								<PasswordIcon />
							</ListItemIcon>
							<ListItemText primary="Change Password" />
						</ListItemButton>
					</ListItem>
					<ListItem
						disablePadding
						onClick={() => userContext?.setSelectedTab("tab3")}
					>
						<ListItemButton sx={{ height: 56 }}>
							<ListItemIcon>
								<LocalShippingIcon />
							</ListItemIcon>
							<ListItemText primary="Packages" />
						</ListItemButton>
					</ListItem>
					<ListItem
						disablePadding
						onClick={() => userContext?.setSelectedTab("tab4")}
					>
						<ListItemButton sx={{ height: 56 }}>
							<ListItemIcon>
								<AddIcon />
							</ListItemIcon>
							<ListItemText primary="Add Package" />
						</ListItemButton>
					</ListItem>
				</List>
			</nav>
		</Box>
	);
}
