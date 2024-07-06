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
			onSuccess: (data, variables, context) => router.push(`/login`),
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
			<div className="text-center text-2xl font-medium">Sign up</div>
			<form onSubmit={handleSubmit}>
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

				<button className="w-full p-2 bg-slate-900 rounded mt-4">
					Register
				</button>
			</form>
			<aside className="ml-auto w-fit text-sm">
				Already have an account? <a href="/login">Login</a>
			</aside>
		</>
	);
}
