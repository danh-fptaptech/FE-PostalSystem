import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const url = process.env.NEXT_PUBLIC_API_URL + "/Auth/Login";

export const authOptions = {
	// Configure one or more authentication providers
	secret: process.env.NEXTAUTH_SECRET,

	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
				role: { label: "Role" },
			},
			async authorize(credentials, req) {
				try {
					const res = await fetch(url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							userId: credentials?.username,
							password: credentials?.password,
							role: credentials?.role,
						}),
					});

					if (res.ok) {
						const user = await res.json();

						return user;
					}
					return null;
				} catch (error) {
					console.log("Error authorize next-auth", error);
					return null;
				}
			},
		}),
		// ...add more providers here
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		//@ts-ignore
		async jwt({ token, user, trigger, session }) {
			if (user) {
				token.accessToken = user.token;
			}
			if (trigger === "update") {
				token.accessToken = session.token.accessToken;
			}
			// return final token
			return token;
		},

		//@ts-ignore
		async session({ session, token, user }) {
			session.token = token;
			try {
				const res = await fetch(
					process.env.NEXT_PUBLIC_API_URL + "/auth/profile",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token.accessToken}`,
						},
					}
				);

				if (res.ok) {
					const data = await res.json();

					session.user = data;
					if (!data.role) {
						session.user.role = {
							name: "User",
							permissions: ["User"],
						};
						session.token.role = {
							name: "User",
							permissions: ["User"],
						};
					} else {
						session.token.role = data.role;
					}
				}
			} catch (error) {
				console.log("Error session auth:", error);
			}
			return session;
		},
	},



};

//@ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
