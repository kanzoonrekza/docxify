import { NextRequest, NextResponse } from "next/server";
const gotenberg_url = process.env.GOTENBERG_URL;

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const file: File = formData.get("files") as File;

	if (!file || !(file.size > 0)) {
		return NextResponse.json(
			{
				status: 400,
				message:
					"No file detected, please make sure your file uploaded correctly",
			},
			{ status: 400 }
		);
	}

	try {
		const response = await fetch(`${gotenberg_url}/forms/libreoffice/convert`, {
			method: "POST",
			body: formData,
			headers: {},
		});

		const blob = await response.blob();
		const pdf = new Blob([blob], {
			type: "application/pdf",
		});

		const headers = new Headers();

		headers.set(
			"Content-Disposition",
			"attachment; filename=converted_document.pdf"
		);

		return new NextResponse(pdf);
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{
				status: 400,
				message: "Error converting file",
				error: error,
				fileSize: file.size,
			},
			{ status: 400 }
		);
	}
}
