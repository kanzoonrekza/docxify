import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { VerifyPassword } from "@/utils/bcrypt";
import { eq, or } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const findUser: any = async (identifier: string) => {
		return await db
			.select()
			.from(users)
			.where(or(eq(users.username, identifier), eq(users.email, identifier)))
			.limit(1);
	};

	try {
		const returnedData = await findUser(
			formData.get("username-email") as string
		);
		if (returnedData.length === 0) {
			throw Error("User not found");
		}

		const verifiedPassword = await VerifyPassword(
			formData.get("password") as string,
			returnedData[0].password
		);

		if (!verifiedPassword) {
			return Response.json({
				message: "Password is incorrect",
			});
		}

		return Response.json({
			message: "Logged in successfully",
		});
	} catch (e) {
		console.log(e);

		return Response.json(
			{
				message: `User with email or username "${formData.get(
					"username-email"
				)}" not found`,
				error: e,
			},
			{ status: 500 }
		);
	}
}
