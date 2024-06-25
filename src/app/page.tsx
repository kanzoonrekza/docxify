import Link from "next/link";

export default function Home() {
	return (
		<main className="flex p-24 justify-center items-center h-screen">
			Go to
			<Link href="/dashboard">/dashboard</Link>
			😉
		</main>
	);
}
