import Link from "next/link";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="sticky top-0 bg-neutral-800 z-10">Doxify</div>
			<div>
				<Link href={"/login"}>Login </Link>
				<Link href={"/signup"}>Sign Up</Link>
			</div>
			{children}
		</>
	);
}
