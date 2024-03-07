import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const url = process.env.NEXT_PUBLIC_API_URL;

export default withAuth(
	// `withAuth` augments your `Request` with the user's token.
	async function middleware(req) {
		const token = req.nextauth.token;
		//console.log(token);

		if (token) {
			const pathname = req.nextUrl.pathname;

			const dynamicPaths = ["[id]", "[token]"];
			// Find a matching path with dynamic path handling
			const path = paths.find(p => {
				if (dynamicPaths.some(dp => p.path.includes(dp))) {
					const regex = new RegExp(p.path.replace(/\[.*?\]/g, ".*"));

					return regex.test(pathname);
				}

				return p.path === pathname;
			});

			if (!path) {
				return NextResponse.redirect(new URL("/", req.url));
			}

			const userPermissions = token.role.permissions || [];

			const hasPermission = path.permission.some(p =>
				userPermissions.includes(p)
			);

			if (!hasPermission) {
				return NextResponse.redirect(new URL("/access-denied", req.url));
			}

			return NextResponse.next();
		} else {
			if (
				req.nextUrl.pathname === "/login" ||
				req.nextUrl.pathname === "/employee-login" ||
				req.nextUrl.pathname === "/admin-login"
			)
				return NextResponse.next();
			else if (
				req.nextUrl.pathname.startsWith("/app") ||
				req.nextUrl.pathname.startsWith("/app/employee") ||
				req.nextUrl.pathname.startsWith("/app/admin/employees")
			) {
				return NextResponse.redirect(new URL("/", req.url));
			}
		}
	},
	{
		callbacks: {
			authorized: async ({ token }) => {
				return true;
			},
		},
	}
);

export const config = {
	// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|auth/|access-denied|forgot-password|reset-password|register|$).*)",
	],
};

const paths = [
	{
		path: "/app",
		permission: ["user.access", "user.all", "home.access", "app.view"],
	},
	{
		path: "/register",
		permission: ["user.access", "user.all", "home.access"],
	},

	{
		path: "/app/packages",
		permission: ["user.access", "app.view"],
	},
	{
		path: "/app/employee",
		permission: ["user.access"],
	},
	{
		path: "/app/historylogs",
		permission: ["user.access"],
	},

	//admin
	{
		path: "/app/branches",
		permission: ["app.view"],
	},
	{
		path: "/app/admin/users",
		permission: ["app.view"],
	},
	{
		path: "/app/admin/employees",
		permission: ["app.view"],
	},
	{
		path: "/app/admin/roles",
		permission: ["app.view"],
	},
	{
		path: "/app/admin/requests",
		permission: ["app.view"],
	},
	{
		path: "/app/services",
		permission: ["user.access", "user.all", "home.access"],
	},
];
