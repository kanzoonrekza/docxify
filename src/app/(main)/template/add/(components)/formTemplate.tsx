"use client";

import React from "react";
import { FormField, TypeFormField } from "@/components/formField";
import { ContextSelectedFile } from "@/contexts/selectedFile";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const formAddList: TypeFormField[] = [
	{ name: "title", label: "Title", required: true },
	{ name: "description", label: "Description", required: false },
	{ name: "category", label: "Category", required: true },
];

export default function FormTemplate() {
	const router = useRouter();
	const { selectedFile, selectedTags } = React.useContext(ContextSelectedFile);
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

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			{formAddList.map((item: TypeFormField) => (
				<FormField item={item} />
			))}
			<span>
				<label htmlFor={"tags"} className="text-lg">
					Tags
				</label>
				<textarea
					id="tags"
					name="tags"
					className="w-full bg-gray-800 rounded p-1 h-60"
					value={JSON.stringify(selectedTags, null, 2)}
					readOnly
				/>
			</span>
			<button
				className="ml-auto mt-5 p-2 bg-green-700 rounded disabled:bg-slate-500"
				type="submit"
				disabled={postTemplate.isPending}
			>
				Submit
			</button>
		</form>
	);
}
