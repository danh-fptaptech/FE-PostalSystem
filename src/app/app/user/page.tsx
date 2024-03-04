"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import TextField from "@mui/material/TextField";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "sonner";

const schema = z.object({
	fullname: z
		.string({
			required_error: "Fullname is required!",
		})
		.min(3, "Fullname must be at least 3 characters!")
		.max(50),
	email: z
		.string({
			required_error: "Email is required!",
		})
		.min(3, "Email must be at least 3 characters!")
		.max(50)
		.email(),
	phone: z
		.string({
			required_error: "Phone is required!",
		})
		.min(3, "Phone must be at least 3 characters!")
		.max(50),
});

type Schema = z.infer<typeof schema>;

const UserProfile = () => {
	const { data: session, status } = useSession();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data: Schema) => {
		const loadingId = toast.loading("Changing...");

		const res = await fetch(`/api/users/${session?.user.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session?.token.accessToken}`,
			},
			body: JSON.stringify(data),
		});

		const payload = await res.json();

		toast.dismiss(loadingId);
		if (payload.ok) {
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				width: "100%",
				margin: "auto",
				padding: "20px",
				borderRadius: "8px",
				boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
				backgroundColor: "white",
			}}
		>
			<Typography
				variant="h5"
				component="div"
				sx={{ mb: 2 }}
			>
				Profile
			</Typography>
			<TextField
				variant="outlined"
				defaultValue={session?.user.fullname}
				fullWidth
				label="Fullname"
				{...register("fullname", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.fullname}
				helperText={errors.fullname?.message}
				margin="normal"
			/>
			<TextField
				variant="outlined"
				defaultValue={session?.user.email}
				fullWidth
				label="Email"
				{...register("email", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.email}
				helperText={errors.email?.message}
				margin="normal"
				InputProps={{
					readOnly: true,
				}}
			/>
			<TextField
				variant="outlined"
				defaultValue={session?.user.phone}
				fullWidth
				label="Phone"
				{...register("phone", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.phone}
				helperText={errors.phone?.message}
				margin="normal"
				InputProps={{
					readOnly: true,
				}}
			/>

			<Button
				type="submit"
				variant="contained"
				color="error"
				fullWidth
				sx={{ mt: 2 }}
			>
				Save
			</Button>
		</Box>
	);
};

export default UserProfile;
