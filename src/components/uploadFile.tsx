"use client";
import { ContextSelectedFile } from "@/contexts/selectedFile";
import React from "react";

export default function UploadFile() {
	const { selectedFile, setSelectedFile } =
		React.useContext(ContextSelectedFile);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) return;

		setSelectedFile(file);
	};

	return (
		<div className="w-full max-w-sm">
			<label
				htmlFor="fileInput"
				className="grid h-full max-h-[1000px] place-items-center rounded border border-dashed bg-base-300 bg-opacity-5 hover:cursor-pointer hover:bg-opacity-10"
			>
				Upload .docx or .doc file
			</label>
			{selectedFile && <aside>Selected file: {selectedFile.name}</aside>}
			<input
				hidden
				type="file"
				name="selectedFile"
				id="fileInput"
				accept=".docx,.doc"
				onChange={handleFileChange}
			/>
		</div>
	);
}
