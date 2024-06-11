import db from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const response = await db
		.select()
		.from(templates)
		.where(eq(templates.id, Number(id)));
	return NextResponse.json(response);
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const response = await db
		.select()
		.from(templates)
		.where(eq(templates.id, Number(id)));

	if (response.length === 0) {
		return NextResponse.json({ message: "Data not found" });
	}

	const data = await request.json();
	const updateTemplate: any = async () => {
		return db
			.update(templates)
			.set(data)
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

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const response = await db
		.select()
		.from(templates)
		.where(eq(templates.id, Number(id)));

	if (response.length === 0) {
		return NextResponse.json({ message: "Data not found" });
	}

	const deleted: { deletedId: number }[] = await db
		.delete(templates)
		.where(eq(templates.id, Number(id)))
		.returning({ deletedId: templates.id });

	return NextResponse.json({
		message: "Data deleted",
		deletedId: deleted[0].deletedId,
	});
}
