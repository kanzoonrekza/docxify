"use client";
import { FormField } from "@/components/formField";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";
import React from "react";
import useSWRMutation from "swr/mutation";

export default function Login() {
	const router = useRouter();
	const { trigger, isMutating } = useSWRMutation(
		"/api/auth/users/login",
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

		formData.append("username-email", formData.get("username-email") as string);
		formData.append("password", formData.get("password") as string);

		trigger(formData);
	};
	return (
		<>
			<div className="text-center text-2xl font-medium">Login</div>
			<form onSubmit={handleSubmit}>
				<FormField
					item={{
						name: "username-email",
						label: "Username or Email",
						required: true,
						type: "text",
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
				Don't have an account? <a href="/signup">Signup</a>
			</aside>
		</>
	);
}
