"use client";
import { FormField } from "@/components/formField";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";
import React from "react";
import useSWRMutation from "swr/mutation";

export default function Signup() {
	const router = useRouter();
	const { trigger, isMutating } = useSWRMutation(
		"/api/auth/users",
		fetcher.post,
		{
			onError: (error, variables, context) =>
				console.error(error, context, variables),
			onSuccess: () => router.push(`/login`),
		}
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData: FormData = new FormData(e.currentTarget);

		formData.append("username", formData.get("username") as string);
		formData.append("email", formData.get("email") as string);
		formData.append("password", formData.get("password") as string);

		trigger(formData);
	};
	return (
		<>
			<div className="text-center text-2xl font-medium mb-4">Sign up</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<FormField
					item={{
						name: "username",
						label: "Username",
						required: true,
						type: "text",
					}}
				/>
				<FormField
					item={{
						name: "email",
						label: "Email",
						required: true,
						type: "email",
					}}
				/>
				<FormField
					item={{
						name: "password",
						label: "Password",
						required: true,
						type: "password",
					}}
				/>

				<button className="btn btn-block btn-neutral">Register</button>
			</form>
			<aside className="ml-auto w-fit text-sm mt-2">
				Already have an account?{" "}
				<a href="/login" className="link link-secondary p-0">
					Login
				</a>
			</aside>
		</>
	);
}
