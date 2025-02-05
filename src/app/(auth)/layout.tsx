"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const { data: session } = useSession();

	if (session) {
		router.push("/dashboard");
	}

	return (
		<div className="h-screen">
			<section className="mx-auto max-w-lg h-full place-content-center">
				<div className="text-center text-4xl font-bold mx-auto">
					Docxify
				</div>
				{children}
			</section>
		</div>
	);
}
