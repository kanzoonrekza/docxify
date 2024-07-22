"use client";
import { templateDetailType } from "@/types";
import { fetcher } from "@/utils/fetcher";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

export default function TemplateList({ orgid }: { orgid: number }) {
	const { data, error, isLoading } = useSWR(
		"/api/core/templates?orgid=" + orgid,
		fetcher.get
	);
	const gridClassname = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2";

	if (isLoading)
		return (
			<div className={gridClassname}>
				{[...Array(5)].map((_, index) => (
					<div key={index} className="skeleton h-24" />
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
			<p className="">
				You have no templates.
				<br />
				<Link href={`/template/${orgid}/add`} className="link link-secondary">
					Create new
				</Link>{" "}
				or ask your admin to add you to one.
			</p>
		);

	return (
		<>
			{data.length > 0 && (
				<div className={gridClassname}>
					{data.map((template: templateDetailType) => (
						<Link
							href={`/template/${orgid}/${template.id}`}
							key={template.id}
							className="card-compact rounded border hover:border-neutral transition-colors duration-200"
						>
							<div className="card-body gap-0">
								<div className="flex-grow">
									<div className="flex gap-2 flex-wrap">
										<div className="badge badge-sm badge-neutral">
											{template.category}
										</div>
										{template.apiReady && (
											<div className="badge badge-sm badge-accent">
												Api Ready
											</div>
										)}
									</div>
									<div className="card-title">{template.title}</div>
								</div>
								{template.description && (
									<p className="card-side">{template.description}</p>
								)}
							</div>
						</Link>
					))}
				</div>
			)}
		</>
	);
}
