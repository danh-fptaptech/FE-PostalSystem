"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { UserContext } from "@/contexts/UserContext";
import UserChangePasswordForm from "./UserChangePasswordForm";
// import UserPackages from "./UserPackages";
import UserProfile from "./UserProfile";

const UserPage = () => {
	const { data: session, status } = useSession();
	const userContext = React.useContext(UserContext);

	if (status === "authenticated") {
		switch (userContext?.selectedTab) {
			case "tab1":
				return <UserProfile />;
			case "tab2":
				return <UserChangePasswordForm />;
			case "tab3":
				// return <UserPackages />;
			default:
				return null;
		}
	}

	return <div>Unauthenticated</div>;
};

export default UserPage;
