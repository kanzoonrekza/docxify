import React from "react";
import FormOrganization from "./formOrganization";

export default function AddOrganization() {
	return (
		<main className="flex flex-col gap-5 p-10 h-full">
			<h1 className="text-5xl font-medium mb-5">Add New Organization</h1>
			<div className="gap-5 h-full mx-auto max-w-screen-sm w-full">
				<FormOrganization />
			</div>
		</main>
	);
}
