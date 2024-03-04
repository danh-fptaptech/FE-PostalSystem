"use client";

import { UserContextProvider } from "@/contexts/UserContext";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
