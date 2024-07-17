"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import OrganizationList from "./organizationList";

export default function Dashboard() {
	const session = useSession();

	return (
		<main className="flex flex-col gap-10 p-10">
			<div className="flex items-center justify-between ">
				{/* @ts-ignore */}
				<div className="text-4xl">Hello, {session?.data?.user?.id}!</div>

				<Link
					href={"/organization/add"}
					className="btn btn-wide btn-neutral disabled:btn-disabled"
				>
					Create Organization
				</Link>
			</div>
			<OrganizationList />
		</main>
	);
}
