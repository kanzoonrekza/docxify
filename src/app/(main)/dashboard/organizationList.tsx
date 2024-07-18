"use client";
import { useUserOrg } from "@/contexts/userOrgContext";
import Link from "next/link";

export default function OrganizationList() {
	const { data, error, isLoading } = useUserOrg();
	const gridClassname =
		"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2";

	if (isLoading)
		return (
			<div className={gridClassname}>
				{[...Array(5)].map((_, index) => (
					<div key={index} className="skeleton h-32" />
				))}
			</div>
		);

	if (error)
		return (
			<p>
				It looks like something went wrong.
				<br />
				Please wait a moment or try reloading the page.
				<br />
				Consider{" "}
				<Link href={"/organization/add"} className="link link-secondary">
					logging in
				</Link>{" "}
				again to see if that helps.
			</p>
		);

	if (data.length === 0)
		return (
			<p>
				You have no organizations.
				<br />
				<Link href={"/organization/add"} className="link link-secondary">
					Create new
				</Link>{" "}
				or ask your admin to add you to one.
			</p>
		);

	return (
		<div className={gridClassname}>
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
