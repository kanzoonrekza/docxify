import db from "@/db/drizzle";
import { organizationUsers, users } from "@/db/schema";
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
