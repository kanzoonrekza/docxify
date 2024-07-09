import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });

	if (!token) {
		console.log("No token");
		return NextResponse.json(
			{ message: "Forbidden, no token" },
			{ status: 403 }
		);
	}

	const res = NextResponse.next();
	//@ts-ignore
	res.headers.set("userid", token.id); // Set the token as a custom header res
	return res;
}

// Define the matcher function to specify which routes should use this middleware
export const config = {
	matcher: ["/api/core/:path*"], // Adjust this pattern to match the routes you want to protect
};
