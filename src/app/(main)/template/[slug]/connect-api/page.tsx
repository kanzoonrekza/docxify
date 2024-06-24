"use client";
import { FormField, TypeFormField } from "@/components/formField";
import { templateDetailType } from "@/types";
import fetcher from "@/utils/fetcher";
import Link from "next/link";
import React from "react";
import useSWR, { SWRResponse } from "swr";
import useSWRMutation from "swr/mutation";
import {
	getNestedValue,
	mockApiData,
} from "../generate-forms/connectedApiForm";

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
	const {
		data: fetchApiData,
		trigger,
		isMutating,
	} = useSWRMutation("/api/mock/phase-1", fetcher.post, {
		onError: (error, variables, context) => {
			console.error("Error on fetch conenction API", error, context, variables);
		},
		onSuccess: (data, variables, context) => {
			const newValues = formGenerateList.reduce((acc: any, item) => {
				acc[item.name] = getNestedValue(data, connectApiTag[item.name]) || "";
				return acc;
			}, {});
			setConnectApiTagValue((prevValues: any) => ({
				...prevValues,
				...newValues,
			}));
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
		const formData = new FormData(form);

		let jsonData: any = {};
		mockApiData.api_params.forEach((param: string) => {
			jsonData[`${param}`] = formData.get(`api_params_${param}`);
		});

		trigger(jsonData);
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
								Body
							</label>
							<table className="w-full border divide-y bg-neutral-900 border-neutral-600 divide-neutral-600">
								<tr className="divide-x divide-neutral-600 bg-neutral-950">
									<th>Key</th>
									<th>Value</th>
								</tr>
								{mockApiData.api_params.map((param: string) => (
									<tr className="divide-x divide-neutral-600" key={param}>
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
						<div className="flex justify-end w-full">
							<button
								type="button"
								className="px-4 py-1 border border-neutral-400"
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
								value: JSON.stringify(fetchApiData, null, 2),
								status: !fetchApiData
									? undefined
									: fetchApiData.status === 200
									? "Success"
									: "Error",
							}}
						/>
					</section>
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
										className="w-full p-1 bg-gray-800 rounded"
										placeholder="tag"
										onChange={(e) => {
											setConnectApiTag({
												...connectApiTag,
												[item.name]: e.target.value,
											});
											setConnectApiTagValue({
												...connectApiTagValue,
												[item.name]:
													getNestedValue(fetchApiData, e.target.value) || "",
											});
										}}
									/>
									<input
										type="text"
										id={`value_${item.name}`}
										name={`value_${item.name}`}
										value={connectApiTagValue[item.name]}
										placeholder="preview value"
										className="w-full p-1 bg-gray-800 rounded"
										readOnly
									/>
								</div>
							</span>
						))}
					</section>

					<div className="grid grid-cols-2 gap-5 pt-5">
						<Link
							href={`/template/${params.slug}`}
							className="flex justify-center p-2 border border-red-600"
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
