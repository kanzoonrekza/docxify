import mockPhase1Data from "@/mocks/file/phase1/phase1Data.json";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const params = await request.json();
	const nip = params.nip;

	if (!nip) {
		return NextResponse.json(
			{
				status: 404,
				message: "No nip detected, please make sure your nip is correct",
				params,
			},
			{ status: 404 }
		);
	}

	const resultData = mockPhase1Data.find((teacher) => teacher.nip === nip);

	if (!resultData) {
		return NextResponse.json(
			{
				status: 404,
				message: "No data found for this nip",
				params,
			},
			{ status: 404 }
		);
	}

	return NextResponse.json({
		status: 200,
		data: resultData,
		params,
	});
}
