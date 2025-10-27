import db from "@/db/drizzle";
import { organizations, organizationUsers, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const members = await db
		.select({
			username: users.username,
			email: users.email,
			role: organizationUsers.role,
			createdAt: organizationUsers.createdAt,
			updatedAt: organizationUsers.updatedAt,
		})
		.from(organizationUsers)
		.leftJoin(users, eq(users.username, organizationUsers.userId))
		.where(eq(organizationUsers.organizationId, Number(id)));

	return NextResponse.json(members);
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;

	const response: any = await db
		.select()
		.from(organizations)
		.where(eq(organizations.id, Number(id)));

	if (response.length === 0) {
		return NextResponse.json({ message: "Data not found" });
	}

	const deleteOrganization: any = async () => {
		return db.delete(organizations).where(eq(organizations.id, Number(id)));
	};

	try {
		await deleteOrganization();
		return Response.json({
			message: "Success deleting organization",
		});
	} catch (e) {
		return Response.json(
			{ message: `Failed deleting organization`, error: e },
			{ status: 500 }
		);
	}
}
