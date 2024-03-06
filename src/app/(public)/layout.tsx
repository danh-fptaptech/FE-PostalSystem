// components/Layout.js
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { PersonAddAlt, Login } from "@mui/icons-material";
import { AppBar, Button, Container, Link, Toolbar } from "@mui/material";
import * as React from "react";
import LinkBehaviour from "@/components/LinkBehaviour";

const Layout = ({ children }: any) => {
	const { data: session, status } = useSession();
	return (
		<>
			<header>
				<AppBar position="fixed">
					<Toolbar>
						<Container
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<h1>Tars Postal</h1>
							<div>
								{session ? (
									<Button
										startIcon={<Login fontSize="small" />}
										variant="text"
										color="inherit"
										className="mr-2 hover:shadow-lg"
										onClick={() => signOut()}>
										Logout
									</Button>
								) : (
									<Link
										component={LinkBehaviour}
										color="inherit"
										className="text-white uppercase text-decoration-none"
										href="/login">
										<Button
											startIcon={<Login fontSize="small" />}
											variant="text"
											color="inherit"
											className="mr-2 hover:shadow-lg">
											Login
										</Button>
									</Link>
								)}

								<Button
									startIcon={<PersonAddAlt fontSize="small" />}
									variant="text"
									color="inherit"
									className="text-white uppercase mr-2 hover:shadow-lg"
									href="/register">
									Register
								</Button>
								<Button
									variant="contained"
									href="/app"
									color="secondary">
									To App
								</Button>
							</div>
						</Container>
					</Toolbar>
				</AppBar>
			</header>
			<Toolbar />
			<main>{children}</main>
			<footer>
				<Container>
					<p>&copy; {new Date().getFullYear()} Tars Postal</p>
				</Container>
			</footer>
		</>
	);
};

export default Layout;
