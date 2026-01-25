"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const demoAccounts = [
	{
		username: "user",
		password: "user",
		role: "Owner",
		description:
			"Prebuilt as an organization owner. Full access to all features",
	},
	{
		username: "user1",
		password: "user",
		role: "Admin",
		description:
			"Organization's admin user with more access to app features",
	},
	{
		username: "user2",
		password: "user2",
		role: "Member",
		description: "Standard user with limited permissions",
	},
];

export default function Login() {
	const router = useRouter();
	const [error, setError] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [username, setUsername] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [showDemoPopup, setShowDemoPopup] = React.useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(false);
		const formData: FormData = new FormData(e.currentTarget);

		const result = await signIn("credentials", {
			username: formData.get("username-email") as string,
			password: formData.get("password") as string,
			redirect: false,
		});
		setLoading(false);

		if (result?.error) {
			setError(true);
			console.log(result.error);
		} else {
			router.push("/dashboard");
		}
	};

	const handleDemoClick = (account: (typeof demoAccounts)[0]) => {
		setUsername(account.username);
		setPassword(account.password);
		setShowDemoPopup(false);
	};

	return (
		<>
			<div className="mb-4 flex items-center justify-center gap-2 text-center text-2xl font-medium">
				<span>Login</span>
				<button
					type="button"
					onClick={() => setShowDemoPopup(true)}
					className="btn btn-circle btn-ghost btn-sm"
					aria-label="Show demo accounts"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="h-5 w-5 opacity-70"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
						/>
					</svg>
				</button>
			</div>

			{/* Demo Accounts Modal */}
			{showDemoPopup && (
				<>
					<div
						className="fixed inset-0 z-40 bg-black bg-opacity-50"
						onClick={() => setShowDemoPopup(false)}
					></div>
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
							<div className="card-body">
								<div className="flex items-center justify-between">
									<h3 className="card-title text-lg">
										Demo Accounts
									</h3>
									<button
										type="button"
										onClick={() => setShowDemoPopup(false)}
										className="btn btn-circle btn-ghost btn-sm"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
											className="h-5 w-5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
								<p className="text-sm opacity-70">
									Click an account to autofill the login form
								</p>
								<div className="mt-4 grid gap-3">
									{demoAccounts.map((account) => (
										<button
											key={account.username}
											type="button"
											onClick={() =>
												handleDemoClick(account)
											}
											className="btn h-auto min-h-0 justify-start border border-base-300 bg-base-200 p-4 text-left hover:border-primary hover:bg-base-300"
										>
											<div className="flex w-full flex-col gap-2">
												<div className="flex items-center gap-2">
													<span className="font-mono text-base font-semibold">
														{account.username}
													</span>
													<span className="badge badge-primary badge-sm text-white">
														{account.role}
													</span>
												</div>
												<p className="text-xs opacity-70">
													{account.description}
												</p>
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</>
			)}

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div>
					<label className="label">
						<span className="label-text">Username or Email</span>
					</label>
					<input
						type="text"
						name="username-email"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="input input-bordered w-full"
						required
					/>
				</div>
				<div>
					<label className="label">
						<span className="label-text">Password</span>
					</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="input input-bordered w-full"
						required
					/>
				</div>

				<button
					className="btn btn-neutral btn-block"
					disabled={loading}
				>
					{loading ? (
						<span className="loading loading-dots" />
					) : (
						"Login"
					)}
				</button>
			</form>
			<aside className="ml-auto mt-2 w-fit text-sm">
				Don&apos;t have an account?{" "}
				<a href="/signup" className="link link-secondary p-0">
					Signup
				</a>
			</aside>
			{error && (
				<div className="pt-5 text-center text-sm text-red-500">
					Loign failed. Please make sure you have entered the correct
					username or email and password.
				</div>
			)}
		</>
	);
}
