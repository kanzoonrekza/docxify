"use client";
import DropdownOrganization from "@/components/dropdownOrganization";
import { ContextProviderUserOrg } from "@/contexts/userOrgContext";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const {
		data: session,
		update: updateSession,
		status,
	} = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/login");
		},
	});
	if (!session) return <div>loading...</div>;

	const handleLogOut = async () => {
		await signOut({ redirect: true, callbackUrl: "/login" });
	};

	return (
		<div className="h-screen flex flex-col">
			<ContextProviderUserOrg>
				<div className="sticky top-0 z-10 bg-neutral-800 flex justify-between">
					<div className="flex gap-4">
						<Link href="/dashboard">Docxify</Link>
						<DropdownOrganization />
					</div>
					<button onClick={handleLogOut}>Logout</button>
				</div>
				<div className="flex-1 max-w-screen-2xl mx-auto w-full">{children}</div>
			</ContextProviderUserOrg>
		</div>
	);
}
