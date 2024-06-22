import { FormField, TypeFormField } from "@/components/formField";
import { templateDetailType } from "@/types";
import { readFileBuffer } from "@/utils/docs-templates";
import createReport from "docx-templates";
import React from "react";

export default function ManualForm({
	data,
}: {
	data: templateDetailType | undefined;
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
		data?.tags.map((tag: templateDetailType["tags"][number]) => ({
			name: tag.code,
			label: tag.code,
			required: true,
		})) || [];

	return (
		<form onSubmit={handleGenerate}>
			{formGenerateList.map((tag: TypeFormField) => (
				<FormField item={tag} key={tag.name} />
			))}
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
	);
}
