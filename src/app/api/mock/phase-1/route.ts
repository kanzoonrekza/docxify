import mockPhase1Data from "@/mocks/file/phase1/phase1Data.json";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const nip = await request.nextUrl.searchParams.get("nip");

	if (!nip) {
		return NextResponse.json(
			{
				status: 400,
				message: "No nip detected, please make sure your nip is correct",
				nip,
			},
			{ status: 400 }
		);
	}

	const resultData = mockPhase1Data.find((teacher) => teacher.nip === nip);

	if (!resultData) {
		return NextResponse.json(
			{
				status: 400,
				message: "No data found for this nip",
				nip,
			},
			{ status: 400 }
		);
	}

	return NextResponse.json({
		status: 200,
		data: resultData,
		nip,
	});
}
