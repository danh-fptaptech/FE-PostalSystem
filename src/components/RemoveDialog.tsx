import { CloseOutlined } from "@mui/icons-material";
import {
	Dialog,
	Tooltip,
	DialogTitle,
	DialogContent,
	Button,
} from "@mui/material";
import React from "react";

function RemoveDialog() {
	const [openDeleteForm, setOpenDeleteForm] = React.useState(false);
	return (
		<div>
			<Dialog
				open={openDeleteForm}
				onClose={() => setOpenDeleteForm(false)}
				className="max-w-[500px] mx-auto">
				<Tooltip title="Close">
					<CloseOutlined
						onClick={() => setOpenDeleteForm(false)}
						color="error"
						className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
					/>
				</Tooltip>

				<DialogTitle className="text-center mt-2">
					Are you sure to remove ?
				</DialogTitle>

				<DialogContent>
					<div className="flex justify-around my-3">
						<Button
							type="submit"
							color="success"
							variant="contained"
							size="medium"
							className="w-full mr-2">
							Yes
						</Button>
						<Button
							type="reset"
							color="error"
							variant="contained"
							size="medium"
							className="w-full">
							No
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default RemoveDialog;
