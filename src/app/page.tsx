import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center p-24">
      Go to
      <Link href="/dashboard">/dashboard</Link>
      😉
    </main>
  );
}
