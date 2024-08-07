"use client";

import React from "react";
import { FormField, TypeFormField } from "@/components/formField";
import { ContextSelectedFile } from "@/contexts/selectedFile";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { fetcher } from "@/utils/fetcher";

export default function FormTemplate({ orgid }: { orgid: number }) {
	const router = useRouter();
	const { selectedFile, selectedTags, tagsStatus } =
		React.useContext(ContextSelectedFile);

	const { trigger, isMutating } = useSWRMutation(
		"/api/core/templates",
		fetcher.post,
		{
			onError: (error, variables, context) =>
				console.error(error, context, variables),
			onSuccess: (data, variables, context) =>
				router.push(`/template/${orgid}`),
		}
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData: FormData = new FormData(e.currentTarget);

		formAddList.forEach((form) => {
			formData.append(form.name, formData.get(form.name) as string);
		});
		formData.append("orgid", orgid.toString());
		formData.append("file", selectedFile as File);

		trigger(formData);
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
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-3 max-w-2xl w-full"
		>
			{formAddList.map((item: TypeFormField) => (
				<FormField item={item} key={item.name} />
			))}
			<button
				className="btn btn-neutral ml-auto btn-wide"
				type="submit"
				disabled={isMutating || tagsStatus?.status === "Error"}
			>
				{isMutating ? <span className="loading loading-dots" /> : "Create"}
			</button>
		</form>
	);
}
