import React from "react";
import FormOrganization from "./formOrganization";

export default function AddOrganization() {
	return (
		<main className="flex flex-col gap-10 p-10">
			<h1 className="text-3xl font-bold">Create New Organization</h1>
			<FormOrganization />
		</main>
	);
}
