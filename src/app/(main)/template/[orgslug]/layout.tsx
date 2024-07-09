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
	const { data } = useUserOrg();

	const current = data?.filter(
		(org: any) => org.organizationId === Number(params.orgslug)
	);

	return (
		<div>
			{current && current.length === 1 && (
				<div>
					<Link href={"/dashboard"}>Dashboard</Link>
					{" > "}
					<Link href={"/template/" + params.orgslug}>
						{current[0].organization.name}
					</Link>
				</div>
			)}
			<div>{children}</div>
		</div>
	);
}
