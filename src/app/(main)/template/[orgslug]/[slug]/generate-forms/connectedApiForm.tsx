import { FormField, TypeFormField } from "@/components/formField";
import { templateDetailType } from "@/types";
import { readFileBuffer } from "@/utils/docs-templates";
import fetcher from "@/utils/fetcher";
import createReport from "docx-templates";
import Link from "next/link";
import React from "react";
import useSWRMutation from "swr/mutation";

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
}: {
	data: templateDetailType | undefined;
	params: { orgslug: number; slug: number };
}) {
	const [targetAPI, setTargetAPI] = React.useState<string>("");
	const {
		data: fetchApiData,
		trigger,
		isMutating,
		error: fetchApiError,
	} = useSWRMutation(targetAPI, fetcher.get, {
		onError: (error, variables, context) => {
			console.log("Error on fetch conenction API", error, context, variables);
		},
		onSuccess: (res, variables, context) => {
			formGenerateList.map((form: any) => {
				const input = document.getElementById(form.name) as HTMLInputElement;
				if (input) {
					input.value =
						getNestedValue(res, data?.api_connected_tags[form.name] || "") ||
						"";
				}
			});
		},
	});
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
					<Link
						href={`/template/${params.orgslug}/${params.slug}/connect-api`}
						className="px-3 text-sm border"
					>
						Connect Now
					</Link>
				</div>
			)}
			{data?.apiReady && (
				<form onSubmit={handleGenerate}>
					<section className="relative px-2 py-1 border rounded-lg">
						<Link
							href={`/template/${params.orgslug}/${params.slug}/connect-api`}
							className="absolute right-0 px-3 mr-2 text-sm border"
						>
							Edit API
						</Link>
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
							<table className="w-full border divide-y bg-neutral-900 border-neutral-600 divide-neutral-600">
								<tr className="divide-x divide-neutral-600 bg-neutral-950">
									<th>Key</th>
									<th>Value</th>
								</tr>
								{data?.api_param.map((param: string) => (
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
					{/* <section className="grid grid-cols-2 px-2 py-1 mt-3 border gap-x-2"> */}
					<section className="px-2 py-1 mt-3 border">
						{formGenerateList.map((tag: TypeFormField) => (
							<FormField item={tag} key={tag.name} />
						))}
					</section>

					<div className="grid grid-cols-2 gap-5 pt-5">
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
			)}
		</>
	);
}
