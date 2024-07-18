"use client";

import { FormField, TypeFormField } from "@/components/formField";
import { fetcher } from "@/utils/fetcher";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import useSWRMutation from "swr/mutation";

export default function FormOrganization() {
	const router = useRouter();
	const session = useSession();
	const { trigger, isMutating, error } = useSWRMutation(
		"/api/core/organizations",
		fetcher.post,
		{
			onError: (error, variables, context) =>
				console.error(error, context, variables),
			onSuccess: (data, variables, context) => router.push(`/dashboard`),
		}
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData: FormData = new FormData(e.currentTarget);
		// @ts-ignore
		const userId = session.data.user.id;

		if (!userId) return console.log("No user id");

		formData.append("name", formData.get("name") as string);
		formData.append("owner", userId as string);

		trigger(formData);
	};

	const formAddList: any[] = [
		{ name: "name", label: "Organization Name", required: true },
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
				disabled={isMutating}
			>
				{isMutating ? <span className="loading loading-dots" /> : "Create"}
			</button>
		</form>
	);
}
