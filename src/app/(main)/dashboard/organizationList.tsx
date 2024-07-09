"use client";
import { useUserOrg } from "@/contexts/userOrgContext";
import Link from "next/link";

export default function OrganizationList() {
	const { data, isLoading } = useUserOrg();

	if (isLoading) return <div>loading...</div>;
	if (!data) return <div>loading...</div>;

	return (
		<div className="grid grid-cols-4 gap-5">
			{data.map((organization: any) => (
				<div
					key={organization.organizationId}
					className="p-3 border rounded-lg flex flex-col"
				>
					<div>{organization.organization.name}</div>
					<div>Owner: {organization.organization.owner}</div>
					<Link
						className="border"
						href={`/template/${organization.organizationId}`}
					>
						Templates
					</Link>
					{organization.organization.owner === organization.userId && (
						<Link
							className="border"
							href={`/organization/${organization.organizationId}`}
						>
							Organization Detail
						</Link>
					)}
				</div>
			))}
		</div>
	);
}
