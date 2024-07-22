"use client";
import { ContextProviderUserOrg } from "@/contexts/userOrgContext";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = useSession();
	const router = useRouter();

	const handleLogOut = async () => {
		await signOut({ redirect: true, callbackUrl: "/login" });
	};

	if (session.status === "loading") {
		return (
			<div className="min-h-screen grid place-content-center">
				<div className="loading loading-ring w-20" />
			</div>
		);
	}

	if (session.status === "unauthenticated") {
		router.push("/login");
		return (
			<div className="min-h-screen grid place-content-center">
				<h1 className="text-2xl font-bold">
					User unauthenticated. Now redirecting to login page.
				</h1>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<ContextProviderUserOrg>
				<div className="sticky top-0 z-10 bg-neutral">
					<div className="flex justify-between py-2 px-5 items-center max-w-screen-2xl mx-auto w-full">
						<Link href="/dashboard" className="text-base-100 font-bold">
							Docxify
						</Link>
						<button
							className="btn btn-content btn-xs"
							onClick={handleLogOut}
							type="button"
						>
							Logout
						</button>
					</div>
				</div>
				<div className="flex-1 max-w-screen-2xl mx-auto w-full">{children}</div>
				<div className="divider py-10 divider-neutral">
					<button
						className="link link-hover"
						onClick={() => {
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
					>
						Docxify
					</button>
				</div>
			</ContextProviderUserOrg>
		</div>
	);
}
