"use client"
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
			<section className="mx-auto px-4 py-16 max-w-lg bg-slate-950 h-full">
				<div className="mb-5 mx-auto text-center text-4xl font-bold ">
					Docxify
				</div>
				{children}
			</section>
		</div>
	);
}
