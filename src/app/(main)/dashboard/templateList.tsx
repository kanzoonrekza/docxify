"use client";
import { templateDetailType } from "@/types";
import { fetcher } from "@/utils/fetcher";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

export default function TemplateList() {
	const { data, error, isLoading } = useSWR("/api/core/templates", fetcher.get);
	
	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;
	
	return (
		<div className="grid grid-cols-4 gap-5">
			{data.map((template: templateDetailType) => (
				<Link
					href={`/template/${template.id}`}
					key={template.id}
					className="p-3 border rounded-lg"
				>
					<div className="flex items-center justify-start h-10 gap-3 mb-4">
						<div className="grid h-full rounded aspect-square bg-slate-600 place-content-center">
							T
						</div>
						<div className="flex-grow">
							<div>{template.title}</div>
							<div className="text-sm">{`${template.category} ${
								template.apiReady ? "- Api Ready" : ""
							} `}</div>
						</div>
					</div>
					<p className="line-clamp-3">{template.description}</p>
				</Link>
			))}
		</div>
	);
}
