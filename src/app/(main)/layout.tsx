"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const { data: session } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/login");
		},
	});

	const handleLogOut = async () => {
		await signOut({ redirect: true, callbackUrl: "/login" });
	};

	if (!session) return <div>loading...</div>;

	return (
		<div className="h-screen flex flex-col">
			<div className="sticky top-0 z-10 bg-neutral-800 flex justify-between">
				<Link href="/dashboard">Docxify</Link>
				<button onClick={handleLogOut}>Logout</button>
			</div>
			<div className="flex-1 max-w-screen-2xl mx-auto w-full">{children}</div>
		</div>
	);
}
