"use client";
import { FormField } from "@/components/formField";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";
import React from "react";
import useSWRMutation from "swr/mutation";

export default function Signup() {
	const router = useRouter();
	const { trigger, isMutating, error } = useSWRMutation(
		"/api/auth/users",
		fetcher.post,
		{
			onError: async (error, variables, config) => {
				console.error(error, config, variables);
			},
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

				<button
					className="btn btn-block btn-neutral"
					disabled={isMutating}
				>
					{isMutating ? (
						<span className="loading loading-dots" />
					) : (
						"Register"
					)}
				</button>
			</form>
			<aside className="ml-auto w-fit text-sm mt-2">
				Already have an account?{" "}
				<a href="/login" className="link link-secondary p-0">
					Login
				</a>
			</aside>
			{error && !isMutating && (
				<div className="text-red-500 text-center text-sm pt-5">
					{error.body.error.detail.includes("already exists")
						? error.body.error.detail.includes("email")
							? "Email already used. Please use a different email or login with your existing account."
							: "Username already used. Please use a different username or login with your existing account."
						: "An error occurred. Try again later or contact support."}
				</div>
			)}
		</>
	);
}
