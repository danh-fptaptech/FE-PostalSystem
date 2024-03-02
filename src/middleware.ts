import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const url = process.env.NEXT_PUBLIC_API_URL;

export default withAuth(
	// `withAuth` augments your `Request` with the user's token.
	async function middleware(req) {
		const token = req.nextauth.token;

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
			if (req.nextUrl.pathname === "/login") return NextResponse.next();
			else if (req.nextUrl.pathname.startsWith("/app/dashboard")) {
				return NextResponse.redirect(new URL("/login", req.url));
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
		"/((?!api|_next/static|_next/image|favicon.ico|auth/|access-denied|forgot-password|reset-password|$).*)",
	],
};

const paths = [
	{
		path: "/app",
		permission: ["home.access"],
	},
	{
		path: "/app/users",
		permission: ["user.access", "user.all", "home.access"],
	},
	{
		path: "/app/dashboard",
		permission: ["user.access", "Admin", "User"],
	},
	{
		path: "/app/branchs",
		permission: ["user.access", "Admin"],
	},
];
