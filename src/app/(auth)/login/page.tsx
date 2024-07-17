"use client";
import { FormField } from "@/components/formField";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Login() {
	const router = useRouter();
	const [error, setError] = React.useState<boolean>(false);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(false);
		const formData: FormData = new FormData(e.currentTarget);

		const result = await signIn("credentials", {
			username: formData.get("username-email") as string,
			password: formData.get("password") as string,
			redirect: false,
		});

		if (result?.error) {
			setError(true);
			console.log(result.error);
		} else {
			router.push("/dashboard");
		}
	};

	return (
		<>
			<div className="text-center text-2xl font-medium mb-4">Login</div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

				<button className="btn btn-block btn-neutral">Login</button>
			</form>
			<aside className="ml-auto w-fit text-sm mt-2">
				Don&apos;t have an account?{" "}
				<a href="/signup" className="link link-secondary p-0">
					Signup
				</a>
			</aside>
			{error && (
				<div className="text-red-500 text-center text-sm pt-5">
					Loign failed. Please make sure you have entered the correct username
					or email and password.
				</div>
			)}
		</>
	);
}
