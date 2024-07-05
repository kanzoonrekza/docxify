import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { HashPassword } from "@/utils/bcrypt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	type NewUser = typeof users.$inferInsert;

	const insertUser: any = async (NewData: NewUser) => {
		return db.insert(users).values(NewData).returning();
	};

	const formData = await request.formData();
	const newData: NewUser = {
		username: formData.get("username") as string,
		email: formData.get("email") as string,
		password: await HashPassword(formData.get("password") as string),
	};

	try {
		const returnedData = await insertUser(newData);
		console.log(returnedData);

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
