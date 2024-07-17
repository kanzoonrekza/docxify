"use client";
import { useUserOrg } from "@/contexts/userOrgContext";
import Link from "next/link";

export default function OrganizationList() {
	const { data, isLoading } = useUserOrg();

	if (isLoading) return <div>loading...</div>;
	if (!data) return <div>loading...</div>;

	return (
		<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 ">
			{data.map((organization: any) => (
				<div
					key={organization.organizationId}
					className="rounded flex flex-col card-compact border hover:border-neutral transition-colors duration-200"
				>
					<div className="card-body gap-0">
						<div className="card-title">{organization.organization.name}</div>
						<div className="card-side">
							Owner: {organization.organization.owner}
						</div>
						<div className="grid grid-cols-2 gap-2 mt-auto pt-3">
							{organization.organization.owner === organization.userId && (
								<Link
									className="border btn btn-outline btn-sm btn-neutral"
									href={`/organization/${organization.organizationId}`}
								>
									Organization
								</Link>
							)}
							<Link
								className="border btn btn-sm btn-neutral"
								href={`/template/${organization.organizationId}`}
							>
								Templates
							</Link>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
