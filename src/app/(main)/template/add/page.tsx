import React from "react";
import DragnDropZone from "./dragnDropZone";

export default function AddTemplate() {
	return (
		<main className="flex flex-col gap-5 p-10">
			<div className="text-4xl">Add New Template</div>
			<DragnDropZone />
		</main>
	);
}
