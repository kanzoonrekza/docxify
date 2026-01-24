import { FormField, TypeFormField } from "@/components/formField";
import { templateDetailType } from "@/types";
import { readFileBuffer } from "@/utils/docs-templates";
import fetcher from "@/utils/fetcher";
import createReport from "docx-templates";
import Link from "next/link";
import React from "react";
import useSWRMutation, { TriggerWithArgs } from "swr/mutation";

export const getNestedValue = (obj: any, path: string) => {
	if (!path) return "";
	return path
		.split(".")
		.reduce(
			(o, key) => (o && o[key] !== "undefined" ? o[key] : undefined),
			obj
		);
};

export default function ConnectedApiForm({
	data,
	params,
	handleDelete,
	loadingDelete,
}: {
	data: templateDetailType | undefined;
	params: { orgslug: number; slug: number };
	handleDelete: TriggerWithArgs<any, any, string, object | FormData>;
	loadingDelete: boolean;
}) {
	const [targetAPI, setTargetAPI] = React.useState<string>("");
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
		onSuccess: (res, variables, context) => {
			formGenerateList.map((form: any) => {
				const input = document.getElementById(
					form.name
				) as HTMLInputElement;
				if (input) {
					input.value =
						typeof getNestedValue(
							res,
							data?.api_connected_tags[form.name] || ""
						) === "object"
							? JSON.stringify(
									getNestedValue(
										res,
										data?.api_connected_tags[form.name] ||
											""
									)
								)
							: getNestedValue(
									res,
									data?.api_connected_tags[form.name] || ""
								);
				}
			});
		},
	});

	const { trigger: triggerConvert, isMutating: isMutatingConvert } =
		useSWRMutation("/api/core/convert", fetcher.post, {
			onError: (error, variables, context) =>
				console.error(error, context, variables),
			onSuccess: (data, variables, context) => {
				const url = URL.createObjectURL(data);
				const link = document.createElement("a");
				link.href = url;
				link.download = `generated.pdf`;
				link.click();
				URL.revokeObjectURL(url);
			},
		});

	const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		let jsonData: any = {};
		data?.tags.forEach((tag) => {
			jsonData[tag.code] =
				tag.type === "FOR"
					? JSON.parse(formData.get(tag.code) as string)
					: formData.get(tag.code);
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
		const file = new File([blob], "default.docx", { type: blob.type });

		const convertFormData = new FormData();
		convertFormData.append("files", file);

		triggerConvert(convertFormData);
	};

	const formGenerateList: TypeFormField[] =
		data?.tags.map((tag: templateDetailType["tags"][number]) => {
			return {
				name: tag.code,
				label: tag.code,
				required: true,
			};
		}) || [];

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

		data?.api_param.forEach((param: string) => {
			const value = formData.get(`api_params_${param}`) as string;
			if (value) {
				params.append(param, value);
			}
		});

		await setTargetAPI(`${fetchUrl}?${params.toString()}`);

		trigger();
	};

	return (
		<>
			{!data?.apiReady && (
				<div className="grid text-center">
					There are no API connected to this template
					{data?.role !== "member" ? (
						<Link
							href={`/template/${params.orgslug}/${params.slug}/connect-api`}
							className="btn btn-outline btn-neutral btn-sm"
						>
							Connect Now
						</Link>
					) : (
						<span>Ask your admin to connect the API</span>
					)}
				</div>
			)}
			{data?.apiReady && (
				<form onSubmit={handleGenerate}>
					<section className="relative flex w-full max-w-2xl flex-col gap-3 rounded-l border-l-4 border-primary px-2">
						{data?.role !== "member" && (
							<Link
								href={`/template/${params.orgslug}/${params.slug}/connect-api`}
								className="btn btn-outline btn-neutral btn-xs absolute -top-1 right-0 mr-2"
							>
								Edit API
							</Link>
						)}
						<FormField
							item={{
								name: "api_url",
								label: "API URL",
								required: true,
								value: data?.api_url,
								readonly: true,
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
								{data?.api_param.map((param: string) => (
									<tr
										className="divide-x divide-neutral"
										key={param}
									>
										<td className="w-1/2">
											<label
												htmlFor={`api_params_${param}`}
												className="w-full"
											>
												<div className="w-full p-1">
													{param}
												</div>
											</label>
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
							</table>
						</span>
						<div className="flex w-full justify-end">
							<button
								type="button"
								className="btn btn-neutral btn-sm"
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
											: "Success",
							}}
						/>
					</section>
					<section className="mt-3 flex w-full max-w-2xl flex-col gap-3 rounded-l border-l-4 border-secondary px-2">
						{formGenerateList.map((tag: TypeFormField) => (
							<FormField item={tag} key={tag.name} />
						))}
					</section>

					<div className="grid grid-cols-2 gap-5 pt-5">
						{data?.role !== "member" && (
							<button
								className="btn btn-outline btn-error"
								type="button"
								onClick={() => {
									handleDelete({});
								}}
								disabled={loadingDelete || isMutatingConvert}
							>
								{loadingDelete ? (
									<span className="loading loading-dots" />
								) : (
									"Delete"
								)}
							</button>
						)}

						<button
							className="btn btn-neutral col-start-2"
							type="submit"
							disabled={loadingDelete || isMutatingConvert}
						>
							{isMutatingConvert ? (
								<span className="loading loading-dots" />
							) : (
								"Generate"
							)}
						</button>
					</div>
				</form>
			)}
		</>
	);
}
