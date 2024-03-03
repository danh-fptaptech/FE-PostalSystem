"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	otp: z
		.string({
			required_error: "Otp is required!",
		})
		.length(6, "Otp must be 6 characters!"),
});

type Schema = z.infer<typeof schema>;

export default function VerifyEmailPage() {
	const [error, setError] = React.useState("");
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const onSubmit = async (formData: Schema) => {
		try {
			const res = await fetch("/api/verify-email", {
				method: "POST",
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await res.json();

			if (data.ok) {
				signIn(undefined, { callbackUrl });
			} else {
				setError(data.message);
			}
		} catch (error: any) {
			console.log(error);
			setError(error);
		}
	};

	return (
		<>
			<section className="bg-ct-blue-600 min-h-screen pt-20">
				<div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
					<div className="md:w-8/12 lg:w-5/12 bg-white px-8 py-10">
						<div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
							<div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
								<div className="mx-auto flex w-full max-w-md flex-col space-y-16">
									<div className="flex flex-col items-center justify-center text-center space-y-2">
										<div className="font-semibold text-3xl">
											<p>Email Verification</p>
										</div>
										<div className="flex flex-row text-sm font-medium text-gray-400">
											<p>
												We have sent a code to your email ba**@dipainhouse.com
											</p>
										</div>
									</div>

									<div>
										<form onSubmit={handleSubmit(onSubmit)}>
											<div className="flex flex-col space-y-16">
												<div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
													<div className="h-16">
														<input
															{...register("otp", {
																setValueAs: v => (v === "" ? undefined : v),
															})}
															className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
															type="number"
														/>
														<span className="block text-red-500">
															{errors.otp?.message}
														</span>
														<span className="block text-red-500">{error}</span>
													</div>
												</div>

												<div className="flex flex-col space-y-5">
													<div>
														<button
															type="submit"
															className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
														>
															Verify Account
														</button>
													</div>

													<div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
														<p>Didn&apos;t recieve code?</p>{" "}
														<a
															className="flex flex-row items-center text-blue-600"
															href="http://"
															target="_blank"
															rel="noopener noreferrer"
														>
															Resend
														</a>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
