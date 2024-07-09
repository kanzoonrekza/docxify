"use client";
import React from "react";
import ConnectedApiForm from "./generate-forms/connectedApiForm";
import ManualForm from "./generate-forms/manualForm";
import { useData } from "@/contexts/dataContext";

export default function TemplateSlugPage({
	params,
}: {
	params: { orgslug: number; slug: number };
}) {
	const { data } = useData();
	const [generateMode, setGenerateMode] = React.useState<"manual" | "api">(
		"manual"
	);

	return (
		<main className="grid h-full max-w-screen-xl grid-cols-2 gap-10 p-10 mx-auto">
			<div className="h-[640px] bg-slate-900">
				Document Preview
				<br />
				<a href={data?.fileUrl} download>
					Download document
				</a>
			</div>
			<div className="pb-5">
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
				{generateMode === "api" && (
					<ConnectedApiForm data={data} params={params} />
				)}
			</div>
		</main>
	);
}
