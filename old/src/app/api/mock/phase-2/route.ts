import mockPhase2Data from "@/mocks/file/phase2/phase2Data.json";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const resultData = mockPhase2Data;

	if (!resultData) {
		return NextResponse.json(
			{
				status: 400,
				message: "Error retrieving data",
			},
			{ status: 400 }
		);
	}

	return NextResponse.json({
		status: 200,
		data: resultData,
	});
}
