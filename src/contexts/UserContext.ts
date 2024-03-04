import React from "react";

interface UserContextProps {
	selectedTab: string;
	setSelectedTab: (tab: string) => void;
}

const UserContext = React.createContext<UserContextProps | null>(null);

export { UserContext };
