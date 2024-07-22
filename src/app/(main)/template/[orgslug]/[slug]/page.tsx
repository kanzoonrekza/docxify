"use client";
import React from "react";
import ConnectedApiForm from "./generate-forms/connectedApiForm";
import ManualForm from "./generate-forms/manualForm";
import { useData } from "@/contexts/dataContext";
import useSWRMutation from "swr/mutation";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";

export default function TemplateSlugPage({
	params,
}: {
	params: { orgslug: number; slug: number };
}) {
	const router = useRouter();
	const { data, isLoading } = useData();
	const [generateMode, setGenerateMode] = React.useState<"manual" | "api">(
		"manual"
	);

	const { trigger: triggerDelete, isMutating: isMutatingDelete } =
		useSWRMutation("/api/core/templates/" + params.slug, fetcher.delete, {
			onError: (error, variables, context) =>
				console.error(error, context, variables),
			onSuccess: () => router.push("/template/" + params.orgslug),
		});

	return (
		<main className="flex gap-5 h-full">
			{isLoading ? (
				<div className="skeleton h-[640px] w-full max-w-sm" />
			) : (
				<div className="h-[640px] w-full max-w-sm bg-base-300 bg-opacity-5 hover:bg-opacity-10 border border-dashed rounded">
					Document Preview
					<br />
					<a href={data?.fileUrl} download>
						Download document
					</a>
				</div>
			)}
			<div className="pb-5 flex flex-col gap-3 max-w-2xl w-full">
				{isLoading ? (
					<span className="flex gap-1">
						<aside className="skeleton w-20 h-5" />
						<aside className="skeleton w-20 h-5" />
					</span>
				) : (
					<span className="flex gap-1">
						<aside className="badge badge-neutral">{data?.category}</aside>
						<aside
							className={`flex badge  ${
								data?.apiReady ? "badge-success" : "badge-error"
							}`}
						>
							{data?.apiReady ? "API Ready" : "API Not Ready"}
						</aside>
					</span>
				)}
				{isLoading ? (
					<h1 className="skeleton w-full h-9 mb-2" />
				) : (
					<h1 className="text-3xl font-bold">{data?.title}</h1>
				)}
				<div>{data?.description}</div>
				<div className="flex justify-center p-1 m-1 mx-auto border rounded w-fit">
					<button
						className={`px-3 py-1 text-sm leading-snug rounded ${
							generateMode === "manual" && "bg-neutral text-neutral-content"
						}`}
						onClick={() => setGenerateMode("manual")}
					>
						Manual
					</button>
					<button
						className={`px-3 py-1 text-sm leading-snug rounded ${
							generateMode === "api" && "bg-neutral text-neutral-content"
						}`}
						onClick={() => setGenerateMode("api")}
					>
						Use API
					</button>
				</div>
				{isLoading && (
					<>
						{[...Array(5)].map((_, index) => (
							<div key={index} className="skeleton h-10 w-full" />
						))}
					</>
				)}
				{!isLoading && generateMode === "manual" && (
					<ManualForm
						data={data}
						handleDelete={triggerDelete}
						loadingDelete={isMutatingDelete}
					/>
				)}
				{!isLoading && generateMode === "api" && (
					<ConnectedApiForm
						data={data}
						params={params}
						handleDelete={triggerDelete}
						loadingDelete={isMutatingDelete}
					/>
				)}
			</div>
		</main>
	);
}
