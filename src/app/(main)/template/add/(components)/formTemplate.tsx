"use client";

import React from "react";
import { FormField, TypeFormField } from "@/components/formField";
import { ContextSelectedFile } from "@/contexts/selectedFile";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function FormTemplate() {
	const router = useRouter();
	const { selectedFile, selectedTags, tagsStatus } =
		React.useContext(ContextSelectedFile);
	const postTemplate = useMutation({
		mutationFn: (formData: FormData) => {
			return fetch("/api/templates", {
				method: "POST",
				body: formData,
			}).then((res) => res.json());
		},
		onMutate: () => {
			console.log("Mutating");
		},
		onError: (error, variables, context) => {
			console.log(error);
		},
		onSuccess: (data, variables, context) => {
			console.log(data);
			router.push(`/template/${data.data.id}`);
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData: FormData = new FormData(e.currentTarget);

		formAddList.forEach((form) => {
			formData.append(form.name, formData.get(form.name) as string);
		});
		formData.append("file", selectedFile as File);

		postTemplate.mutate(formData);
	};

	const formAddList: TypeFormField[] = [
		{ name: "title", label: "Title", required: true },
		{ name: "description", label: "Description", required: false },
		{ name: "category", label: "Category", required: true },
		{
			name: "tags",
			label: "Tags",
			required: true,
			readonly: true,
			type: "textarea",
			value: JSON.stringify(selectedTags, null, 2),
			status: tagsStatus?.status,
			footnote: tagsStatus?.message,
		},
	];

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			{formAddList.map((item: TypeFormField) => (
				<FormField item={item} />
			))}
			<button
				className="ml-auto mt-5 p-2 bg-green-700 rounded disabled:bg-slate-500 disabled:cursor-not-allowed"
				type="submit"
				disabled={postTemplate.isPending || tagsStatus?.status === "Error"}
			>
				Submit
			</button>
		</form>
	);
}
