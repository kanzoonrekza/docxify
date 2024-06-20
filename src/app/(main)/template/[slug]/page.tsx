"use client";
import { templateDetailType } from "@/types";
import { fetcher } from "@/utils/fetcher";
import React from "react";
import useSWR, { SWRResponse } from "swr";
import ConnectedApiForm from "./generate-forms/connectedApiForm";
import ManualForm from "./generate-forms/manualForm";

export default function TemplateSlugPage({
	params,
}: {
	params: { slug: number };
}) {
	const [generateMode, setGenerateMode] = React.useState<"manual" | "api">(
		"manual"
	);
	const { data, error, isLoading }: SWRResponse<templateDetailType, Error> =
		useSWR("/api/templates/" + params.slug, fetcher.get);

	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;

	return (
		<main className="grid h-full max-w-screen-xl grid-cols-2 gap-10 p-10 mx-auto">
			<div className="h-[640px] bg-slate-900">
				Document Preview
				<br />
				<a href={data?.fileUrl} download>
					Download document
				</a>
			</div>
			<div>
				<aside
					className={`flex w-fit text-xs leading-snug rounded-full px-3 py-1 ${
						data?.apiReady ? "bg-green-500" : "bg-red-500"
					}`}
				>
					{data?.apiReady ? "API Ready" : "API Not Ready"}
				</aside>
				<div className="text-4xl">{data?.title}</div>
				<div>{data?.description}</div>
				<div className="flex justify-center p-1 m-1 mx-auto border rounded-full w-fit">
					<button
						className={`px-3 py-1 text-sm leading-snug rounded-full ${
							generateMode === "manual" && "bg-neutral-600"
						}`}
						onClick={() => setGenerateMode("manual")}
					>
						Manual
					</button>
					<button
						className={`px-3 py-1 text-sm leading-snug rounded-full ${
							generateMode === "api" && "bg-neutral-600"
						}`}
						onClick={() => setGenerateMode("api")}
					>
						Use API
					</button>
				</div>
				{generateMode === "manual" && <ManualForm data={data} />}
				{generateMode === "api" && <ConnectedApiForm data={data} />}
			</div>
		</main>
	);
}
