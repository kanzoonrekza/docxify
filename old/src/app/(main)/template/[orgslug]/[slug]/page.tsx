"use client";
import React from "react";
import ConnectedApiForm from "./generate-forms/connectedApiForm";
import ManualForm from "./generate-forms/manualForm";
import { useData } from "@/contexts/dataContext";
import useSWRMutation from "swr/mutation";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import { FormField } from "@/components/formField";

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

	const getCurrentBaseURL = (url: string) => {
		const { protocol, host } = new URL(url);
		return `${protocol}//${host}`;
	};

	const shareLink = `${getCurrentBaseURL(
		window?.location?.href
	)}/api/generate/${params.slug}?s=${data?.secret}${data?.api_param
		?.map((param) => {
			return "&" + param + "={{" + param + "}}";
		})
		.join("")}`;

	return (
		<main className="grid h-full grid-cols-5 gap-5 pt-5">
			<div className="relative col-span-2 h-full w-full">
				<div className="sticky top-14 aspect-[10/15] w-full border-2 border-black bg-[#D1D1D1]">
					{isLoading ? (
						<div className="skeleton w-full max-w-sm" />
					) : (
						<iframe
							src={`https://docs.google.com/viewer?url=${encodeURIComponent(
								data?.fileUrl || ""
							)}&embedded=true`}
							width="100%"
							height="100%"
						></iframe>
					)}
				</div>
			</div>
			<div className="col-span-3 flex w-full max-w-2xl flex-col gap-3">
				{isLoading ? (
					<span className="flex gap-1">
						<aside className="skeleton h-5 w-20" />
						<aside className="skeleton h-5 w-20" />
					</span>
				) : (
					<span className="flex gap-1">
						<aside className="badge badge-neutral">
							{data?.category}
						</aside>
						<aside
							className={`badge flex ${
								data?.apiReady ? "badge-success" : "badge-error"
							}`}
						>
							{data?.apiReady ? "API Ready" : "API Not Ready"}
						</aside>
					</span>
				)}
				{isLoading ? (
					<h1 className="skeleton mb-2 h-9 w-full" />
				) : (
					<h1 className="flex items-center gap-2 text-3xl font-bold">
						<span>{data?.title}</span>
						<Modal.Button
							id="share-template"
							className="btn btn-square btn-ghost btn-xs"
							onClick={() => {
								console.log(
									`${process.env.NEXTAUTH_URL}/api/generate/${params.orgslug}?secret=${data?.secret}&${params.slug}`
								);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="#000000"
								viewBox="0 0 256 256"
							>
								<path d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z"></path>
							</svg>
						</Modal.Button>
					</h1>
				)}
				<div>{data?.description}</div>
				<div className="m-1 mx-auto flex w-fit justify-center rounded border p-1">
					<button
						className={`rounded px-3 py-1 text-sm leading-snug ${
							generateMode === "manual" &&
							"bg-neutral text-neutral-content"
						}`}
						onClick={() => setGenerateMode("manual")}
					>
						Manual
					</button>
					<button
						className={`rounded px-3 py-1 text-sm leading-snug ${
							generateMode === "api" &&
							"bg-neutral text-neutral-content"
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
			<Modal id="share-template">
				<div className="flex flex-col gap-2">
					<h2>Share Template</h2>
					<FormField
						item={{
							label: "",
							value: shareLink,
							name: "share-link",
							readonly: true,
						}}
					/>
					<aside className="text-xs text-error">{`When integrating, replace the {{param}} with the value`}</aside>
					<button
						className="btn btn-outline btn-sm btn-block"
						onClick={() => {
							try {
								navigator.clipboard.writeText(shareLink);
								alert("Copied to clipboard!");
							} catch (err) {
								console.error("Failed to copy: ", err);
							}
						}}
					>
						Copy Link
					</button>
				</div>
			</Modal>
		</main>
	);
}
