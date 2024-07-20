import db from "@/db/drizzle";
import { organizationUsers } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	type NewOrganizationUsers = typeof organizationUsers.$inferInsert;

	const insertOrganizationUsers: any = async (
		NewData: NewOrganizationUsers
	) => {
		return db.insert(organizationUsers).values(NewData).returning();
	};
	const formData = await request.formData();

	const newDataUsers: NewOrganizationUsers = {
		userId: formData.get("username") as string,
		role: formData.get("role") as string,
		organizationId: Number(id),
	};

	try {
		const returnedDataUsers = await insertOrganizationUsers(newDataUsers);
		return Response.json({
			message: "Success inserting data",
			data: returnedDataUsers[0],
		});
	} catch (e) {
		return Response.json(
			{
				message: `Failed inserting data user organization`,
				error: e,
				data: newDataUsers,
			},
			{ status: 500 }
		);
	}
}
