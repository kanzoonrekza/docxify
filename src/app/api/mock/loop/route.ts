import loopData from "@/mocks/file/loopExample/loopData.json";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const mockdata = await request.nextUrl.searchParams.get("data");
	const rawData = loopData;

	if (!mockdata) {
		return NextResponse.json(
			{
				status: 400,
				message: "Search parameters missing: 'data'",
			},
			{ status: 400 }
		);
	}

	if (!rawData) {
		return NextResponse.json(
			{
				status: 400,
				message: "Error retrieving data",
			},
			{ status: 400 }
		);
	}

	const selectedData = rawData[mockdata];

	if (!selectedData) {
		return NextResponse.json(
			{
				status: 400,
				message: `Data not found for data ${mockdata}. Available data: ${Object.keys(rawData).join(", ")}`,
			},
			{ status: 400 }
		);
	}

	return NextResponse.json({
		status: 200,
		data: selectedData,
	});
}
