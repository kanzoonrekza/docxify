"use client";
import Link from "next/link";
import TemplateList from "./templateList";
import { useUserOrg } from "@/contexts/userOrgContext";

export default function TemplatePage({
	params,
}: {
	params: { orgslug: number };
}) {
	const { data, isLoading } = useUserOrg();
	const current = data?.filter(
		(org: any) => org.id === Number(params.orgslug)
	);

	if (isLoading) {
		return (
			<div className="min-h-screen grid place-content-center">
				<div className="loading loading-ring w-20" />
			</div>
		);
	}

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="text-4xl">All Templates</div>
				{current[0]?.role !== "member" && (
					<Link
						href={`/template/${params.orgslug}/add`}
						className="btn btn-wide btn-neutral"
					>
						Create Template
					</Link>
				)}
			</div>
			<TemplateList orgid={params.orgslug} />
		</>
	);
}
