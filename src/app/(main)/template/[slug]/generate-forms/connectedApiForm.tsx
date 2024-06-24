import { FormField, TypeFormField } from "@/components/formField";
import { templateDetailType } from "@/types";
import { readFileBuffer } from "@/utils/docs-templates";
import createReport from "docx-templates";
import Link from "next/link";
import React from "react";

export const mockApiData: any = {
	api_link: "https://api.example.com/api/get-data",
	api_params: ["nip"],
	api_data: {
		value_a: "result api 1",
		value_b: "result api 2",
		value_c: "result api 3",
		value_d: {
			inner_value1: "result api 4",
			inner_value2: "result api 5",
			inner_value3: "result api 6",
		},
	},
	api_connected_tags: {
		nomor_dokumen: "value_a",
		nama: "value_b",
		nip: "value_c",
		pangkat: "value_d.inner_value1",
		jabatan: "value_d.inner_value2",
		tanggal_lahir: "value_d.inner_value3",
	},
};

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
	slug,
}: {
	data: templateDetailType | undefined;
	slug: number;
}) {
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

		let jsonData: any = {};
		mockApiData.api_params.forEach((param: string) => {
			jsonData[`api_params_${param}`] = formData.get(`api_params_${param}`);
		});

		// TODO: Fetch API
		const fetchedData = mockApiData.api_data;

		formGenerateList.map((form: any) => {
			const input = document.getElementById(form.name) as HTMLInputElement;

			if (input) {
				// const valuePath = mockApiData.api_connected_tags[form.name];
				const value = getNestedValue(
					fetchedData,
					mockApiData.api_connected_tags[form.name]
				);
				input.value = value;
			}
		});
	};

	return (
		<>
			{!data?.api && (
				<div className="grid text-center">
					There are no API connected to this template
					<Link
						href={`/template/${slug}/connect-api`}
						className="px-3 text-sm border"
					>
						Connect Now
					</Link>
				</div>
			)}
			{data?.api && (
				<form onSubmit={handleGenerate}>
					<section className="relative px-2 py-1 border rounded-lg">
						<Link
							href={`/template/${slug}/connect-api`}
							className="absolute right-0 px-3 mr-2 text-sm border"
						>
							Edit API
						</Link>
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
								value: JSON.stringify(mockApiData.api_data, null, 2),
								// status: tagsStatus?.status,
								// footnote: tagsStatus?.message,
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
