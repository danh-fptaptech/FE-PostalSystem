import { CircularProgress } from "@mui/material";
import * as React from "react";

export default function Loading() {
	return (
		<div className="flex justify-center items-center my-3">
			<CircularProgress
				variant="indeterminate"
				color="error"
			/>
		</div>
	);
}
