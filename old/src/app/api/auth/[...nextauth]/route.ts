import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { VerifyPassword } from "@/utils/bcrypt";
import { eq, or } from "drizzle-orm";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username/Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) {
					return null;
				}

				const user = await db
					.select()
					.from(users)
					.where(
						or(
							eq(users.username, credentials.username),
							eq(users.email, credentials.username.toLowerCase())
						)
					)
					.limit(1);

				if (user.length === 0) {
					return null;
				}

				const isValidPassword = await VerifyPassword(
					credentials.password,
					user[0].password
				);

				if (!isValidPassword) {
					return null;
				}

				return {
					id: user[0].username,
					username: user[0].username,
					email: user[0].email,
				};
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }: any) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
});

export { handler as GET, handler as POST };
