"use client";
import { signIn, signOut, useSession } from "next-auth/react";
("use client");
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const Home = () => {
	const { data: session, status } = useSession();

	const handleSignOut = () => {
		fetch("/api/Users/revoke-token", {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${session?.token.accessToken}`,
			},
		}).then(() => {});
	};

	if (status === "authenticated") {
		return (
			<div>
				<div>
					<h1>Page Ok</h1>
					<p>This is a page.</p>
				</div>
				<p>Signed in as {session.user.fullname}</p>
				<a href="/api/auth/signout">Sign out</a>
				<button
					className="p-2 border"
					onClick={() => {
						signOut().then(() => {
							handleSignOut();
						});
					}}
				>
					Sign out
				</button>
			</div>
		);
	}

	return (
		<div>
			<div>
				<h1>Page Ok</h1>
				<p>This is a page.</p>
			</div>
			<button
				className="p-2 border"
				onClick={() => signIn()}
			>
				Sign in
			</button>
			<a href="/api/auth/signin">Sign in</a>
		</div>
	);
};

export default Home;
