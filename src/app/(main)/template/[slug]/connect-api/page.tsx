"use client";
import { FormField, TypeFormField } from "@/components/formField";
import { templateDetailType } from "@/types";
import fetcher from "@/utils/fetcher";
import Link from "next/link";
import React from "react";
import useSWR, { SWRResponse } from "swr";
import {
	getNestedValue,
	mockApiData,
} from "../generate-forms/connectedApiForm";

const targetValue = {
	nomor_dokumen: "value_a",
	nama: "value_b",
	nip: "value_c",
	pangkat: "value_d.inner_value1",
	jabatan: "value_d.inner_value2",
	tanggal_lahir: "value_d.inner_value3",
};

export default function EditTemplatePage({
	params,
}: {
	params: { slug: number };
}) {
	const [connectApiTag, setConnectApiTag] = React.useState<any>({});
	const [connectApiTagValue, setConnectApiTagValue] = React.useState<any>({});
	const { data, error, isLoading }: SWRResponse<templateDetailType, Error> =
		useSWR("/api/templates/" + params.slug, fetcher.get, {
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,

			onSuccess: (data: any) => {
				const jsonData: any = {};
				data?.tags.map((tag: templateDetailType["tags"][number]) => {
					jsonData[tag.code] = "";
				});
				setConnectApiTag(jsonData);
				setConnectApiTagValue(jsonData);
			},
		});

	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;

	const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(connectApiTag);
	};
	const handleFetchAPI = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const form = e.currentTarget.closest("form");
		if (!form) {
			console.error("Form not found");
			return;
		}
	};
	const formGenerateList: TypeFormField[] =
		data?.tags.map((tag: templateDetailType["tags"][number]) => {
			return {
				name: tag.code,
				label: tag.code,
				required: true,
			};
		}) || [];

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
					className={`flex w-fit text-xs leading-snug rounded-full px-3 py-1 bg-gray-500`}
				>
					Editing API Connection
				</aside>
				<div className="text-4xl">{data?.title}</div>
				<form onSubmit={handleGenerate}>
					<section className="border px-2 py-1 relative rounded-lg">
						{/* <Link href={`/template/${slug}/connect-api`} className="absolute right-0 mr-2 border px-3 text-sm">Edit API</Link> */}
						<FormField
							item={{
								name: "api_link",
								label: "API Link",
								required: true,
								value: mockApiData.api_link,
								readonly: true,
							}}
						/>
						<span>
							<label htmlFor="" className="text-lg">
								Params
							</label>
							<table className="w-full bg-neutral-900 border border-neutral-600 divide-y divide-neutral-600">
								<tr className="divide-x divide-neutral-600 bg-neutral-950">
									<th>Key</th>
									<th>Value</th>
								</tr>
								{mockApiData.api_params.map((param: string) => (
									<tr className="divide-x divide-neutral-600">
										<td className="w-1/2">
											<label htmlFor={`api_params_${param}`} className="w-full">
												<div className="w-full p-1">{param}</div>
											</label>
										</td>
										<td className="w-1/2">
											<input
												type="text"
												id={`api_params_${param}`}
												name={`api_params_${param}`}
												className="w-full p-1 bg-inherit"
											/>
										</td>
									</tr>
								))}
							</table>
						</span>
						<div className="w-full flex justify-end">
							<button
								type="button"
								className="py-1 px-4 border border-neutral-400"
								onClick={handleFetchAPI}
							>
								Fetch
							</button>
						</div>
						<FormField
							item={{
								name: "tags",
								label: "Tags",
								readonly: true,
								type: "textarea",
								value: JSON.stringify(mockApiData.api_data, null, 2),
								// status: tagsStatus?.status,
								// footnote: tagsStatus?.message,
							}}
						/>
					</section>
					{/* <section className="border px-2 py-1 grid grid-cols-2 gap-x-2 mt-3"> */}
					<section className="border px-2 py-1 mt-3">
						{formGenerateList.map((item: TypeFormField) => (
							<span key={item.name}>
								<label htmlFor={item.name} className="text-lg">
									{item.label}
									{item.required && <span className="text-red-500">*</span>}
								</label>
								<div className="grid grid-cols-2 gap-x-2">
									<input
										required={item.required}
										type="text"
										id={item.name}
										name={item.name}
										value={item.value}
										className="w-full bg-gray-800 rounded p-1"
										placeholder="tag"
										onChange={(e) => {
											setConnectApiTag({
												...connectApiTag,
												[item.name]: e.target.value,
											});
											setConnectApiTagValue({
												...connectApiTagValue,
												[item.name]: getNestedValue(
													mockApiData.api_data,
													e.target.value
												),
											});
										}}
									/>
									<input
										type="text"
										id={`value_${item.name}`}
										name={`value_${item.name}`}
										value={connectApiTagValue[item.name]}
										placeholder="preview value"
										className="w-full bg-gray-800 rounded p-1"
										readOnly
									/>
								</div>
							</span>
						))}
					</section>

					<div className="grid grid-cols-2 gap-5 pt-5">
						<Link
							href={`/template/${params.slug}`}
							className="p-2 border border-red-600 flex justify-center"
							type="button"
							onClick={() => {}}
						>
							Cancel
						</Link>
						<button className="p-2 border border-gray-400" type="submit">
							Save
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
