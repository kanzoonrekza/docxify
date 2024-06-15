"use client";
import { templateDetailType } from "@/types";
import { readFileBuffer } from "@/utils/docs-templates";
import { fetcher } from "@/utils/fetcher";
import createReport from "docx-templates";
import React from "react";
import useSWR, { SWRResponse } from "swr";

export default function TemplateSlugPage({
	params,
}: {
	params: { slug: number };
}) {
	const { data, error, isLoading }: SWRResponse<templateDetailType, Error> =
		useSWR("/api/templates/" + params.slug, fetcher.get);

	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;

	const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		let jsonData: any = {};
		data?.tags.forEach((tag) => {
			jsonData[tag.code] = formData.get(tag.code);
		});
		const fetchedFile = await fetch(data?.fileUrl as string).then(
			(res) => res.blob() as Promise<File>
		);
		const template: any = await readFileBuffer(fetchedFile);

		const report: any = await createReport({
			template,
			cmdDelimiter: ["{{", "}}"],
			data: jsonData,
			errorHandler: (err, command_code) => {
				console.log(err, command_code);

				return "command failed!";
			},
		});

		const blob = new Blob([report], {
			type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		});

		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${data?.title}_generated.docx`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="max-w-screen-xl mx-auto">
			<main className="grid h-full grid-cols-2 gap-10 p-10">
				<div className="h-[640px] bg-slate-900">
					Document Preview
					<br />
					<a href={data?.fileUrl} download>
						Download document
					</a>
				</div>
				<div className="overflow-y-auto">
					<div className="text-4xl">{data?.title}</div>
					<div>{data?.apiReady ? "API Ready" : "API Not Ready"}</div>
					<div>{data?.description}</div>
					<div>Tags</div>
					<form onSubmit={handleGenerate}>
						<ul>
							{data?.tags.map((tag: templateDetailType["tags"][number]) => (
								<li key={tag.raw}>
									<label htmlFor={tag.code}>{tag.code}</label>
									<br />
									<input
										type="text"
										id={tag.code}
										name={tag.code}
										className="w-full bg-slate-700"
									/>
								</li>
							))}
						</ul>
						<div className="grid grid-cols-2 gap-5">
							<button
								className="p-2 border border-red-600"
								type="button"
								onClick={() => {}}
							>
								Delete
							</button>
							<button className="p-2 border border-gray-400" type="submit">
								Generate
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}
