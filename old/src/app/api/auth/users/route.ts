import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { HashPassword } from "@/utils/bcrypt";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	type NewUser = typeof users.$inferInsert;

	const insertUser: any = async (NewData: NewUser) => {
		return db.insert(users).values(NewData).returning();
	};

	const formData = await request.formData();
	const username = formData.get("username") as string;

	const user = await db
		.select()
		.from(users)
		.where(sql`LOWER(${users.username}) = LOWER(${username})`);

	if (user.length > 0) {
		return NextResponse.json(
			{
				message: `Failed inserting data`,
				error: {
					detail: `Key (username)=(${username}) already exists.`,
				},
			},
			{ status: 500 }
		);
	}

	const newData: NewUser = {
		username: username,
		email: (formData.get("email") as string).toLowerCase(),
		password: await HashPassword(formData.get("password") as string),
	};

	try {
		const returnedData = await insertUser(newData);

		return Response.json({
			message: "Success inserting data",
			data: returnedData[0],
		});
	} catch (e) {
		console.log(e);

		return Response.json(
			{ message: `Failed inserting data`, error: e, data: newData },
			{ status: 500 }
		);
	}
}
