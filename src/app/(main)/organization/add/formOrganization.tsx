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

	if (!session) return <div>Loading...</div>;

	const { trigger, isMutating } = useSWRMutation(
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

	const formAddList: any[] = [{ name: "name", label: "Name", required: true }];

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			{formAddList.map((item: TypeFormField) => (
				<FormField item={item} key={item.name} />
			))}
			<button
				className="p-2 mt-5 ml-auto bg-green-700 rounded disabled:bg-slate-500 disabled:cursor-not-allowed"
				type="submit"
				disabled={isMutating}
			>
				Create
			</button>
		</form>
	);
}
