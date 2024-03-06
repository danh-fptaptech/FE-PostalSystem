"use client";
import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
	const { data: session, status } = useSession();

	return (
		<div>
			<div>
				<h1>Page Ok</h1>
				<p>This is a page.</p>
			</div>
		</div>
	);
};

export default Home;
