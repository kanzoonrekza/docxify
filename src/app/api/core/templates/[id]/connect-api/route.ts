import db from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	type NewTemplate = typeof templates.$inferSelect;

	const id = params.id;
	const response = await db
		.select()
		.from(templates)
		.where(eq(templates.id, Number(id)));

	if (response.length === 0) {
		return NextResponse.json({ message: "Data not found" });
	}

	const formData = await request.formData();
	
	const updatedData: any = {
		api_url: formData.get("api_url") as string,
		api_connected_tags: JSON.parse(
			formData.get("api_connected_tags") as string
		),
		apiReady: formData.get("api_url") !== "" ? true : false,
		api_param: JSON.parse(formData.get("api_param") as string),
	};

	const updateTemplate: any = async () => {
		return db
			.update(templates)
			.set(updatedData)
			.where(eq(templates.id, Number(id)))
			.returning({ data: templates });
	};

	try {
		await updateTemplate();
		return Response.json({
			message: "Success updating data",
		});
	} catch (e) {
		return Response.json(
			{ message: `Failed inserting data`, error: e },
			{ status: 500 }
		);
	}
}
