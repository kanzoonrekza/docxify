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

	const insertTemplate: any = async (NewData: NewTemplate) => {
		return db.insert(templates).values(NewData);
	};

	const formData = await request.formData();
	const newData: NewTemplate = {
		title: formData.get("title") as string,
		description: formData.get("description") as string,
		category: formData.get("category") as string,
		apiReady: (formData.get("apiReady") as string) === "true" ? true : false,
		tags: formData.get("tags") == "" ? null : (formData.get("tags") as object),
		api: formData.get("api") === "" ? null : (formData.get("api") as object),
	};

	try {
		await insertTemplate(newData);
		return Response.json({ message: "Success inserting data", data: newData });
	} catch (e) {
		return Response.json(
			{ message: `Failed inserting data`, error: e, data: newData },
			{ status: 500 }
		);
	}
}
