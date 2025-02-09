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
			<div className="grid min-h-screen place-content-center">
				<div className="loading loading-ring w-20" />
			</div>
		);
	}

	if (session.status === "unauthenticated") {
		router.push("/login");
		return (
			<div className="grid min-h-screen place-content-center">
				<h1 className="text-2xl font-bold">
					User unauthenticated. Now redirecting to login page.
				</h1>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<ContextProviderUserOrg>
				<div className="sticky top-0 z-10 bg-neutral">
					<div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-5 py-2">
						<Link
							href="/dashboard"
							className="font-bold text-base-100"
						>
							Docxify
						</Link>
						<button
							className="btn-content btn btn-xs"
							onClick={handleLogOut}
							type="button"
						>
							Logout
						</button>
					</div>
				</div>
				<div className="mx-auto w-full max-w-screen-2xl flex-1">
					{children}
				</div>
				<div className="divider divider-neutral py-10">
					<button
						className="link-hover link"
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
