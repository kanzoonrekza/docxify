import { FormField, TypeFormField } from "@/components/formField";
import { templateDetailType } from "@/types";
import { readFileBuffer } from "@/utils/docs-templates";
import fetcher from "@/utils/fetcher";
import createReport from "docx-templates";
import React from "react";
import useSWRMutation, { TriggerWithArgs } from "swr/mutation";

export default function ManualForm({
	data,
	handleDelete,
	loadingDelete,
}: {
	data: templateDetailType | undefined;
	handleDelete: TriggerWithArgs<any, any, string, object | FormData>;
	loadingDelete: boolean;
}) {
	const { trigger, isMutating } = useSWRMutation(
		"/api/core/convert",
		fetcher.post,
		{
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
		}
	);

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
		trigger(convertFormData);
	};

	const formGenerateList: TypeFormField[] =
		data?.tags.map((tag: templateDetailType["tags"][number]) => ({
			name: tag.code,
			label: tag.code,
			required: true,
		})) || [];

	return (
		<form
			onSubmit={handleGenerate}
			className="flex flex-col gap-3 max-w-2xl w-full"
		>
			{formGenerateList.map((tag: TypeFormField) => (
				<FormField item={tag} key={tag.name} />
			))}
			<div className="grid grid-cols-2 gap-5 pt-5">
				{data?.role !== "member" && (
					<button
						className="btn btn-outline btn-error"
						type="button"
						onClick={() => {
							handleDelete({});
						}}
						disabled={loadingDelete || isMutating}
					>
						{loadingDelete ? (
							<span className="loading loading-dots" />
						) : (
							"Delete"
						)}
					</button>
				)}
				<button
					className="col-start-2 btn btn-neutral"
					type="submit"
					disabled={loadingDelete || isMutating}
				>
					{isMutating ? <span className="loading loading-dots" /> : "Generate"}
				</button>
			</div>
		</form>
	);
}
