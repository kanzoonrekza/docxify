import db from "@/db/drizzle";
import { organizations, organizationUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const userid = request.headers.get("userid") as string;

	if (!userid)
		return NextResponse.json(
			{ message: "No user id. Please relogin" },
			{ status: 400 }
		);

	const result = await db
		.select()
		.from(organizationUsers)
		.innerJoin(
			organizations,
			eq(organizationUsers.organizationId, organizations.id)
		)
		.where(eq(organizationUsers.userId, userid));

	const transformedResult = result.map((row) => ({
		userId: row.organizationUserTable.userId,
		organizationId: row.organizationUserTable.organizationId,
		organization: {
			id: row.organizationTable.id,
			name: row.organizationTable.name,
			owner: row.organizationTable.owner,
		},
		role: row.organizationUserTable.role,
		createdAt: row.organizationUserTable.createdAt,
		updatedAt: row.organizationUserTable.updatedAt,
	}));

	return NextResponse.json(transformedResult);
}
