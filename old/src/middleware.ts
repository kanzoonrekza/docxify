import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// CORS middleware for /api/generate and /api/mock
	if (
		pathname.startsWith("/api/generate") ||
		pathname.startsWith("/api/mock")
	) {
		const response = NextResponse.next();
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS"
		);
		response.headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization"
		);

		if (req.method === "OPTIONS") {
			return response;
		}

		return response;
	}

	// Existing middleware for other routes
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
	res.headers.set("userid", token.id); // Set the token as a custom header
	return res;
}

// Define the matcher function to specify which routes should use this middleware
export const config = {
	matcher: ["/api/core/:path*", "/api/generate/:path*", "/api/mock/:path*"],
};
