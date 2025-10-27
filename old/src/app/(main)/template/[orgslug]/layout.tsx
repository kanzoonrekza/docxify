"use client";
import { useUserOrg } from "@/contexts/userOrgContext";
import Link from "next/link";
import React from "react";

export default function TemplateLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { orgslug: number };
}) {
	const { data, isLoading } = useUserOrg();

	const current = data?.filter(
		(org: any) => org.id === Number(params.orgslug)
	);

	return (
		<div className="px-10 py-5">
			<div className="breadcrumbs text-sm">
				{isLoading && (
					<ul>
						<li>
							<div className="skeleton h-5 w-20" />
						</li>
						<li>
							<div className="skeleton h-5 w-20" />
						</li>
					</ul>
				)}
				{current && current.length === 1 && (
					<ul>
						<li>
							<Link href={"/dashboard"}>Dashboard</Link>
						</li>
						<li>
							<Link href={"/template/" + params.orgslug}>
								{current[0].name}
							</Link>
						</li>
					</ul>
				)}
			</div>
			<main className="flex flex-col gap-10">{children}</main>
		</div>
	);
}
