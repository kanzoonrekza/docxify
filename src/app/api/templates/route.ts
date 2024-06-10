import db from "@/db/drizzle";
import { templates } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const result = await db.select().from(templates);
	console.log(result);

	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	type NewTemplate = typeof templates.$inferInsert;

	const data: NewTemplate = await request.json();
	const insertTemplate: any = async (newData: NewTemplate) => {
		return db.insert(templates).values(newData);
	};

	try {
		await insertTemplate(data);
		return Response.json({ message: "Success inserting data", data: data });
	} catch (e) {
		return Response.json(
			{ message: `Failed inserting data`, error: e },
			{ status: 500 }
		);
	}
}
