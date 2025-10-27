import { useUserOrg } from "@/contexts/userOrgContext";
import React from "react";

export default function DropdownOrganization() {
	const { data, isLoading, mutate } = useUserOrg();

	if (isLoading) return <div>loading...</div>;
	if (!data) return <div>loading...</div>;

	return (
		<>
			<select
				name="organization"
				id="organization"
				className="border bg-inherit"
			>
				<option
					className="bg-neutral-800"
					key="placeholder"
					value=""
					hidden
				>
					Select an Organization
				</option>
				{data?.map((org: any) => (
					<option
						className="bg-neutral-800"
						key={org.organizationId}
						value={org.id}
					>
						{org.organization.name}
					</option>
				))}
				<option className="bg-neutral-800" key="new" value="new">
					+ Create new organization
				</option>
			</select>
			<button
				onClick={(e) => {
					e.preventDefault();
					mutate();
				}}
			>
				Refresh
			</button>
		</>
	);
}
