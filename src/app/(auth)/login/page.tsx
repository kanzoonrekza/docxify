"use client";
import { FormField } from "@/components/formField";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Login() {
	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData: FormData = new FormData(e.currentTarget);

		const result = await signIn("credentials", {
			username: formData.get("username-email") as string,
			password: formData.get("password") as string,
			redirect: false,
		});

		if (result?.error) {
			console.log(result.error);
		} else {
			router.push("/dashboard");
		}
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
					Login
				</button>
			</form>
			<aside className="ml-auto w-fit text-sm">
				Don&apos;t have an account? <a href="/signup">Signup</a>
			</aside>
		</>
	);
}
