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
		<div>
			<label
				htmlFor="fileInput"
				className="border border-dashed rounded grid place-items-center hover:cursor-pointer bg-white bg-opacity-5 hover:bg-opacity-10 h-full max-h-[1000px]"
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
