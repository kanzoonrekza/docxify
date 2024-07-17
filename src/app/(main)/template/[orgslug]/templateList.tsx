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

	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;

	return (
		<>
			{data.length === 0 && <div>No templates found. Try adding one!</div>}
			{data.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
