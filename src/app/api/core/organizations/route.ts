import db from "@/db/drizzle";
import {
	organizations,
	organizationUsers,
	templates,
	users,
} from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const userid = request.headers.get("userid") as string;

	if (!userid)
		return NextResponse.json(
			{ message: "No user id. Please relogin" },
			{ status: 400 }
		);

	const result = await db
		.select({
			id: organizations.id,
			name: organizations.name,
			owner: organizations.owner,
			role: organizationUsers.role,
			templateCount: count(templates.organizationId),
			connectedTemplateCount: sql<number>`cast(count(case when ${templates.apiReady} = true then 1 else null end) as integer)`,
		})
		.from(organizationUsers)
		.leftJoin(
			organizations,
			eq(organizationUsers.organizationId, organizations.id)
		)
		.leftJoin(
			templates,
			eq(organizationUsers.organizationId, templates.organizationId)
		)
		.where(eq(organizationUsers.userId, userid))
		.groupBy(organizations.id, organizationUsers.role);

	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	type NewOrganization = typeof organizations.$inferInsert;
	type NewOrganizationUsers = typeof organizationUsers.$inferInsert;

	const insertOrganization: any = async (NewData: NewOrganization) => {
		return db.insert(organizations).values(NewData).returning();
	};
	const insertOrganizationUsers: any = async (
		NewData: NewOrganizationUsers
	) => {
		return db.insert(organizationUsers).values(NewData).returning();
	};

	const formData = await request.formData();
	const userid = formData.get("owner") as string;

	const user = await db.select().from(users).where(eq(users.username, userid));

	if (user.length === 0) {
		return NextResponse.json({
			message: "No user found with that id. Please relogin",
		});
	}

	const newData: NewOrganization = {
		name: formData.get("name") as string,
		owner: userid,
	};

	try {
		const returnedData = await insertOrganization(newData);

		const newDataUsers: NewOrganizationUsers = {
			userId: userid,
			role: "owner",
			organizationId: returnedData[0].id,
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
	} catch (e) {
		return Response.json(
			{ message: `Failed inserting data`, error: e, data: newData },
			{ status: 500 }
		);
	}
}
