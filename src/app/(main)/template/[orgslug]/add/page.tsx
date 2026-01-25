"use client";
import FormTemplate from "./(components)/formTemplate";
import UploadFile from "../../../../../components/uploadFile";
import { ContextProviderSelectedFile } from "@/contexts/selectedFile";
import React from "react";

export default function AddTemplate({
	params,
}: {
	params: { orgslug: number };
}) {
	const [showInfoPopup, setShowInfoPopup] = React.useState(false);
	const demoTemplateLink = process.env.NEXT_PUBLIC_DEMO_FILE_UPLOAD_LINK;

	return (
		<main className="flex flex-col gap-10">
			<div className="flex items-center gap-2">
				<h1 className="text-3xl font-bold">Create New Template</h1>
				<button
					type="button"
					onClick={() => setShowInfoPopup(true)}
					className="btn btn-circle btn-ghost btn-sm"
					aria-label="Template creation help"
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

			{/* Info Popup Modal */}
			{showInfoPopup && (
				<>
					<div
						className="fixed inset-0 z-40 bg-black bg-opacity-50"
						onClick={() => setShowInfoPopup(false)}
					></div>
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div className="card w-full max-w-lg border border-base-300 bg-base-100 shadow-xl">
							<div className="card-body">
								<div className="flex items-center justify-between">
									<h3 className="card-title text-lg">
										How to Create a Template
									</h3>
									<button
										type="button"
										onClick={() => setShowInfoPopup(false)}
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
								<div className="mt-4 space-y-4 text-sm">
									<p>
										Templates are .docx or .doc files with
										special tags that get replaced with
										dynamic data when generating documents.
									</p>
									<div>
										<p className="font-medium">
											Tag Format:
										</p>
										<p className="opacity-70">
											Use{" "}
											<code className="rounded bg-base-200 px-1 font-mono text-xs">
												{"{"}
												{"{"}tagName{"}}"}
											</code>{" "}
											for simple values
										</p>
										<p className="opacity-70">
											Use{" "}
											<code className="rounded bg-base-200 px-1 font-mono text-xs">
												{"{"}
												{"{"}FOR item IN items{"}}"}
											</code>{" "}
											for loops
										</p>
									</div>
									{demoTemplateLink && (
										<>
											<div className="divider my-2"></div>
											<div>
												<p className="mb-2 font-medium">
													Need a starting point?
												</p>
												<a
													href={demoTemplateLink}
													download
													className="btn btn-primary btn-sm w-full"
													onClick={() =>
														setShowInfoPopup(false)
													}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="h-4 w-4"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
														/>
													</svg>
													Download Sample Template
												</a>
												<p className="mt-2 text-xs opacity-60">
													Download this pre-made
													template to see how tags
													work and use it as a
													reference.
												</p>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			)}

			<div className="flex h-full gap-5">
				<ContextProviderSelectedFile>
					<UploadFile />
					<FormTemplate orgid={params.orgslug} />
				</ContextProviderSelectedFile>
			</div>
		</main>
	);
}
