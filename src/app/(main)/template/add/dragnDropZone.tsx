"use client";
import React from "react";
import { listCommands } from "docx-templates";
import fs from "fs";

export default function DragnDropZone() {
	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) return;

		setSelectedFile(file);
	};

	React.useEffect(() => {
		if (selectedFile) {
			console.log("File selected:", selectedFile);
			const reader = new FileReader();
			reader.readAsArrayBuffer(selectedFile);
			console.log(reader);
		}
	}, [selectedFile]);

	const checkCommands = async () => {
		if (!selectedFile) return;
		const reader = new FileReader();
		reader.readAsArrayBuffer(selectedFile);

		reader.onload = async (event: ProgressEvent<FileReader>) => {
			const buffer = event.target!.result as ArrayBuffer;
			try {
				const extractedCommands = await listCommands(buffer, ["{{", "}}"]);
				console.log(extractedCommands);
			} catch (e) {
				console.log(e);
			}
		};
	};

	return (
		<div>
			{selectedFile && <p>Selected file: {selectedFile.name}</p>}
			<label htmlFor="fileInput" className="p-2 bg-gray-700 rounded-md">
				Drag 'n' drop a file here, or click to select a file
			</label>
      {/* TODO: Make it drag and droppable ^^ */}
			<br />
			<button
				className="p-2 m-2 bg-red-800 rounded"
				onClick={() => setSelectedFile(null)}
			>
				Clear
			</button>
			<button className="p-2 m-2 rounded bg-slate-800" onClick={checkCommands}>
				Check
			</button>
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
