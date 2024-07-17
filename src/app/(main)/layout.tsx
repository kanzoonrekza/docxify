"use client";
import DropdownOrganization from "@/components/dropdownOrganization";
import { ContextProviderUserOrg } from "@/contexts/userOrgContext";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const handleLogOut = async () => {
		await signOut({ redirect: true, callbackUrl: "/login" });
	};

	return (
		<div className="h-screen flex flex-col">
			<ContextProviderUserOrg>
				<div className="sticky top-0 z-10 bg-primary">
					<div className="flex justify-between py-2 px-5 items-center max-w-screen-2xl mx-auto w-full">
						<Link href="/dashboard" className="text-primary-content font-bold">
							Docxify
						</Link>
						<button className="btn btn-accent btn-sm" onClick={handleLogOut}>
							Logout
						</button>
					</div>
				</div>
				<div className="flex-1 max-w-screen-2xl mx-auto w-full">{children}</div>
			</ContextProviderUserOrg>
		</div>
	);
}
