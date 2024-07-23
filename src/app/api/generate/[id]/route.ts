import db from "@/db/drizzle";
import { templates } from "@/db/schema";
import createReport from "docx-templates";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const getNestedValue = (obj: any, path: string) => {
	if (!path) return "";
	return path
		.split(".")
		.reduce(
			(o, key) => (o && o[key] !== "undefined" ? o[key] : undefined),
			obj
		);
};

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	const searchParams: URLSearchParams = new URLSearchParams(
		request.nextUrl.searchParams
	);

	const secret = searchParams.get("s") as string;

	const response = await db
		.select()
		.from(templates)
		.where(and(eq(templates.id, Number(id)), eq(templates.secret, secret)));

	if (response.length === 0) {
		return NextResponse.json({
			message: "Template not found or your secret is incorrect",
		});
	}

	if (!response[0].apiReady) {
		return NextResponse.json({
			message:
				"Template is not connected to API. Please connect your API first",
		});
	}

	if (response[0].api_param) {
		for (const param of response[0].api_param) {
			if (!searchParams.get(param)) {
				return NextResponse.json({
					message: "Please provide the required parameter",
					param: param,
				});
			}
		}
	}

	const resultFetch = await fetch(
		`${response[0].api_url as string}${request.nextUrl.search}`
	).then((res) => res.json());

	if (resultFetch.status !== 200) {
		return NextResponse.json({
			message: "Error fetching data from API",
			status: resultFetch.status,
			returned: resultFetch,
		});
	}

	const jsonData: any = {};

	if (response[0].api_connected_tags) {
		for (const [key, path] of Object.entries(response[0].api_connected_tags)) {
			jsonData[key] = getNestedValue(resultFetch, path);
		}
	}

	const fetchedFile = await fetch(response[0]?.fileUrl as string).then(
		(res) => res.blob() as Promise<File>
	);
	const template: any = await fetchedFile.arrayBuffer();
	const report: any = await createReport({
		template,
		cmdDelimiter: ["{{", "}}"],
		data: jsonData,
		errorHandler: (err, command_code) => {
			console.log(err, command_code);

			return "command failed!";
		},
	});
	const blob = new Blob([report], {
		type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	});

	const file = new File([blob], "document.docx", { type: blob.type });

	const formData = new FormData();
	formData.append("files", file);

	try {
		const response = await fetch(
			`${process.env.GOTENBERG_URL}/forms/libreoffice/convert`,
			{
				method: "POST",
				body: formData,
				headers: {},
			}
		);

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
				fileSize: fetchedFile.size,
			},
			{ status: 400 }
		);
	}
}
