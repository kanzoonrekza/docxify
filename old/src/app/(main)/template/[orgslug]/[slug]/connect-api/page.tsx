"use client";
import { FormField, TypeFormField } from "@/components/formField";
import { useData } from "@/contexts/dataContext";
import { templateDetailType } from "@/types";
import fetcher from "@/utils/fetcher";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import useSWRMutation from "swr/mutation";
import { getNestedValue } from "../generate-forms/connectedApiForm";

export default function EditTemplatePage({
	params,
}: {
	params: { orgslug: number; slug: number };
}) {
	const router = useRouter();
	const { data, mutate, isLoading } = useData();
	const [connectApiTag, setConnectApiTag] = React.useState<any>({});
	const [targetAPI, setTargetAPI] = React.useState<string>("");
	const [connectApiTagValue, setConnectApiTagValue] = React.useState<any>({});
	const [fetchParams, setFetchParams] = React.useState<string[]>(
		data?.api_param || []
	);
	const newParamRef = React.useRef<any>(null);

	React.useEffect(() => {
		const jsonData: any = {};
		const jsonDataEmpty: any = {};
		data?.tags.map((tag: templateDetailType["tags"][number]) => {
			jsonData[tag.code] = data.apiReady
				? data?.api_connected_tags[tag.code] || ""
				: "";
			jsonDataEmpty[tag.code] = "";
		});
		setConnectApiTag(jsonData);
		setConnectApiTagValue(jsonDataEmpty);
	}, []);

	const {
		data: fetchApiData,
		trigger,
		isMutating,
		error: fetchApiError,
	} = useSWRMutation(targetAPI, fetcher.get, {
		onError: (error, variables, context) => {
			console.log(
				"Error on fetch conenction API",
				error,
				context,
				variables
			);
		},
		onSuccess: (data, variables, context) => {
			const newValues = formGenerateList.reduce((acc: any, item) => {
				acc[item.name] =
					getNestedValue(data, connectApiTag[item.name]) || "";
				return acc;
			}, {});
			setConnectApiTagValue((prevValues: any) => ({
				...prevValues,
				...newValues,
			}));
		},
	});

	const { trigger: connectAPI, isMutating: isConnectAPILoading } =
		useSWRMutation(
			"/api/core/templates/" + params.slug + "/connect-api",
			fetcher.patch,
			{
				onError: (error, variables, context) =>
					console.error(
						">error",
						error,
						">context",
						context,
						">variables",
						variables
					),
				onSuccess: (data, variables, context) => {
					mutate();
					router.push(
						`/template/${params.orgslug}/${params.slug}`,
						{}
					);
				},
			}
		);

	const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const existingFormData = new FormData(e.currentTarget);
		const formData: FormData = new FormData();
		formData.append("api_url", existingFormData.get("api_url") as string);
		formData.append("api_param", JSON.stringify(fetchParams));
		formData.append("api_connected_tags", JSON.stringify(connectApiTag));

		connectAPI(formData);
	};

	const handleFetchAPI = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		const form = e.currentTarget.closest("form");
		if (!form) {
			console.error("Form not found");
			return;
		}
		const formData = new FormData(form);
		const fetchUrl = formData.get("api_url");
		const params = new URLSearchParams();

		fetchParams.forEach((param: string) => {
			const value = formData.get(`api_params_${param}`) as string;
			if (value) {
				params.append(param, value);
			}
		});

		await setTargetAPI(`${fetchUrl}?${params.toString()}`);

		trigger();
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
		<main className="flex h-full gap-5">
			{isLoading ? (
				<div className="skeleton h-[640px] w-full max-w-sm" />
			) : (
				<div className="h-[640px] w-full max-w-sm rounded border border-dashed bg-base-300 bg-opacity-5 hover:bg-opacity-10">
					Document Preview
					<br />
					<a href={data?.fileUrl} download>
						Download document
					</a>
				</div>
			)}
			<div className="flex w-full max-w-2xl flex-col gap-3 pb-5">
				{isLoading ? (
					<aside className="skeleton h-5 w-20" />
				) : (
					<aside className="badge badge-info">
						Editing API Connection
					</aside>
				)}
				{isLoading ? (
					<h1 className="skeleton mb-2 h-9 w-full" />
				) : (
					<h1 className="text-3xl font-bold">{data?.title}</h1>
				)}
				<form onSubmit={handleGenerate}>
					<section className="relative flex w-full max-w-2xl flex-col gap-3 rounded-l border-l-4 border-primary px-2">
						<FormField
							item={{
								name: "api_url",
								label: "API URL",
								required: true,
								defaultValue: data?.api_url,
							}}
						/>
						<span>
							<label htmlFor="" className="text-lg">
								Params
							</label>
							<table className="w-full divide-y divide-neutral border border-neutral">
								<tr className="divide-x divide-neutral bg-neutral text-neutral-content">
									<th>Key</th>
									<th>Value</th>
								</tr>
								{fetchParams.map((param: string) => (
									<tr
										className="divide-x divide-neutral"
										key={param}
									>
										<td className="w-1/2">
											<div className="flex">
												<label
													htmlFor={`api_params_${param}`}
													className="w-full"
												>
													<div className="w-full p-1">
														{param}
													</div>
												</label>
												<button
													type="button"
													className="btn btn-square btn-outline btn-error btn-sm"
													onClick={() => {
														setFetchParams(
															fetchParams.filter(
																(item) =>
																	item !==
																	param
															)
														);
													}}
												>
													X
												</button>
											</div>
										</td>
										<td className="w-1/2">
											<input
												type="text"
												id={`api_params_${param}`}
												name={`api_params_${param}`}
												className="w-full bg-inherit p-1"
											/>
										</td>
									</tr>
								))}
								<tr className="divide-x divide-neutral">
									<td className="w-1/2">
										<input
											type="text"
											id={`new_param`}
											name={`new_param`}
											ref={newParamRef}
											className="w-full bg-inherit p-1"
											placeholder="Type param name"
										/>
									</td>
									<td className="w-1/2">
										<button
											type="button"
											className="btn btn-outline btn-neutral btn-sm btn-block"
											onClick={(
												e: React.MouseEvent<HTMLButtonElement>
											) => {
												if (
													newParamRef.current
														.value === ""
												) {
													console.log("empty ref");
													return;
												}
												if (
													!fetchParams.includes(
														newParamRef.current
															.value
													)
												) {
													setFetchParams([
														...fetchParams,
														newParamRef.current
															.value,
													]);
												}
												newParamRef.current.value = "";
											}}
										>
											Add new params
										</button>
									</td>
								</tr>
							</table>
						</span>
						<div className="flex w-full justify-end">
							<button
								type="button"
								className="btn btn-outline btn-neutral btn-sm"
								onClick={handleFetchAPI}
								disabled={isMutating}
							>
								{isMutating ? (
									<span className="loading loading-dots" />
								) : (
									"Fetch"
								)}
							</button>
						</div>
						<FormField
							item={{
								name: "tags",
								label: "Tags",
								readonly: true,
								type: "textarea",
								value: fetchApiError
									? fetchApiError.message
									: JSON.stringify(fetchApiData, null, 2),
								status:
									!fetchApiData && !fetchApiError
										? undefined
										: fetchApiError
											? "Error"
											: fetchApiData.status === 200
												? "Success"
												: "Error",
							}}
						/>
					</section>
					<section className="mt-3 flex w-full max-w-2xl flex-col gap-3 rounded-l border-l-4 border-secondary px-2">
						{formGenerateList.map((item: TypeFormField) => (
							<span key={item.name}>
								<label
									htmlFor={item.name}
									className="flex items-stretch gap-1"
								>
									{item.label}
									{item.required && (
										<span className="text-sm text-secondary">
											*
										</span>
									)}
								</label>
								<div className="grid grid-cols-2 gap-x-2">
									<input
										required={item.required}
										type="text"
										id={item.name}
										name={item.name}
										value={connectApiTag[item.name]}
										className="w-full rounded border border-base-300 px-1"
										placeholder="tag"
										onChange={(e) => {
											setConnectApiTag({
												...connectApiTag,
												[item.name]: e.target.value,
											});
											setConnectApiTagValue({
												...connectApiTagValue,
												[item.name]:
													getNestedValue(
														fetchApiData,
														e.target.value
													) || "",
											});
										}}
									/>
									<input
										type="text"
										id={`value_${item.name}`}
										name={`value_${item.name}`}
										value={
											typeof connectApiTagValue[
												item.name
											] === "object"
												? JSON.stringify(
														connectApiTagValue[
															item.name
														]
													)
												: connectApiTagValue[item.name]
										}
										placeholder="preview value"
										className="w-full rounded border border-base-300 px-1"
										readOnly
									/>
								</div>
							</span>
						))}
					</section>

					<div className="grid grid-cols-2 gap-5 pt-5">
						<Link
							href={`/template/${params.slug}`}
							className="btn btn-outline btn-error"
							type="button"
							onClick={() => {}}
						>
							Cancel
						</Link>
						<button className="btn btn-neutral" type="submit">
							Save
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
