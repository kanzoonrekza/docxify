import db from "@/db/drizzle";
import { organizationUsers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const formData = await request.formData();
	const userid = formData.get("username") as string;
	const response = await db
		.select()
		.from(organizationUsers)
		.where(
			and(
				eq(organizationUsers.organizationId, Number(id)),
				eq(organizationUsers.userId, userid)
			)
		);

	if (response.length === 0) {
		return NextResponse.json({ message: "Data not found" });
	}

	const updatedData: any = {
		role: formData.get("role") as string,
	};

	const updateRole: any = async () => {
		return db
			.update(organizationUsers)
			.set(updatedData)
			.where(
				and(
					eq(organizationUsers.organizationId, Number(id)),
					eq(organizationUsers.userId, userid)
				)
			)
			.returning({ data: organizationUsers });
	};

	try {
		await updateRole();
		return Response.json({
			message: "Success updating user role",
		});
	} catch (e) {
		return Response.json(
			{ message: `Failed updating user role`, error: e },
			{ status: 500 }
		);
	}
}
