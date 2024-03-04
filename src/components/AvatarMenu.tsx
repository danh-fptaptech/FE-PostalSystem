import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AvatarMenu() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const { data: session, status } = useSession();
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	// if (status === "authenticated") {
	// 	return (
	// 		<div>
	// 			<div className="flex">
	// 				<Button
	// 					id="basic-button"
	// 					aria-controls={open ? "basic-menu" : undefined}
	// 					aria-haspopup="true"
	// 					aria-expanded={open ? "true" : undefined}
	// 					onClick={handleClick}>
	// 					<Avatar>a</Avatar>
	// 				</Button>
	// 				<p>Welcome {session.user.fullname}</p>
	// 			</div>
	// 			<Menu
	// 				id="basic-menu"
	// 				anchorEl={anchorEl}
	// 				open={open}
	// 				onClose={handleClose}
	// 				MenuListProps={{
	// 					"aria-labelledby": "basic-button",
	// 				}}>
	// 				<MenuItem onClick={handleClose}>Profile</MenuItem>
	// 				<MenuItem onClick={signOut}>Logout</MenuItem>
	// 			</Menu>
	// 		</div>
	// 	);
	// }

	return (
		<div>
			<Button
				id="basic-button"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}>
				<Avatar>a</Avatar>
			</Button>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}>
				<MenuItem onClick={handleClose}>Profile</MenuItem>
				<MenuItem onClick={handleClose}>Logout</MenuItem>
			</Menu>
		</div>
	);
}
