import db from "@/db/drizzle";
import { organizationUsers, templates } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getPublicIdFromUrl(url: string) {
	// Regex to match the public ID pattern with the extension
	const regex = /\/upload\/(?:v\d+\/)?(.+\.\w+)$/;
	const match = url?.match(regex);

	// Return the captured group if matched
	return match ? match[1] : "";
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const userid = request.headers.get("userid") as string;

	console.log(userid);

	const id = params.id;
	const response = await db
		.select({ ...templates, role: organizationUsers.role } as any)
		.from(templates)
		.leftJoin(
			organizationUsers,
			and(
				eq(templates.organizationId, organizationUsers.organizationId),
				eq(organizationUsers.userId, userid)
			)
		)
		.where(eq(templates.id, Number(id)));

	return NextResponse.json(response[0]);
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
	const response: any = await db
		.select()
		.from(templates)
		.where(eq(templates.id, Number(id)));
	const deleteTemplate: any = async () => {
		return db.delete(templates).where(eq(templates.id, Number(id)));
	};
	if (response.length === 0) {
		return NextResponse.json({ message: "Data not found" });
	}

	// DEMO MODE: Skip Cloudinary deletion since files are not actually uploaded
	// const publicId = getPublicIdFromUrl(response[0].fileUrl);

	// if (!publicId) {
	// 	return NextResponse.json({ message: "Invalid file url" });
	// }

	try {
		// Skip Cloudinary deletion in demo mode
		// const returnedData = await cloudinary.api.delete_resources([publicId], {
		// 	type: "upload",
		// 	resource_type: "raw",
		// });

		try {
			await deleteTemplate();
			return Response.json({
				message: "Success deleting template",
			});
		} catch (e) {
			return Response.json(
				{ message: `Failed deleting template`, error: e },
				{ status: 500 }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{
				status: 400,
				message: "Error deleting file",
				error: error,
			},
			{ status: 400 }
		);
	}
}
