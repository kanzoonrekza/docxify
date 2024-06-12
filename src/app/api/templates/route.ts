import db from "@/db/drizzle";
import { templates } from "@/db/schema";
import { claudinaryUploadBuffer } from "@/utils/file-operations";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
	const result = await db.select().from(templates);

	return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
	type NewTemplate = typeof templates.$inferInsert;

	const insertTemplate: any = async (NewData: NewTemplate) => {
		return db.insert(templates).values(NewData);
	};

	const formData = await request.formData();
	const file: File = formData.get("file") as File;

	if (!file || file.size === 0) {
		return NextResponse.json({
			message:
				"No file detected, please make sure your file uploaded correctly",
		});
	}

	try {
		const uploadResult: UploadApiResponse = await claudinaryUploadBuffer(file);
		const uniqueTags = JSON.parse(formData.get("tags") as string).filter(
			(tag: any, index: number, self: any[]) =>
				self.findIndex((t) => t.code === tag.code) === index
		);
		const newData: NewTemplate = {
			title: formData.get("title") as string,
			fileUrl: uploadResult.secure_url,
			description: formData.get("description") as string,
			category: formData.get("category") as string,
			apiReady: (formData.get("apiReady") as string) === "true" ? true : false,
			tags: formData.get("tags") == "" ? null : uniqueTags,
			api: formData.get("api") === "" ? null : (formData.get("api") as object),
		};

		try {
			await insertTemplate(newData);
			return Response.json({
				message: "Success inserting data",
				data: newData,
			});
		} catch (e) {
			return Response.json(
				{ message: `Failed inserting data`, error: e, data: newData },
				{ status: 500 }
			);
		}
	} catch (error) {
		// File failed to upload, abort request
		return NextResponse.json({ message: "Error uploading file", error });
	}
}
