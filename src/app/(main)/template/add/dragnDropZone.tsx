"use client";
import React from "react";
import { listCommands } from "docx-templates";
import { readFileBuffer } from "@/utils/docs-templates";
import createReport from "docx-templates";

export default function DragnDropZone() {
	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
	const [generatedFile, setGeneratedFile] = React.useState<Blob | null>(null);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) return;

		setSelectedFile(file);
	};

	const checkCommands = async () => {
		if (!selectedFile) return;
		const fileBuffer = await readFileBuffer(selectedFile);

		await listCommands(fileBuffer as ArrayBuffer, ["{{", "}}"])
			.then((res) => console.log(res))
			.catch((e) => {
				console.log(e);
			});
	};

	const handleGenerate = async () => {
		if (!selectedFile) return;
		const template: any = await readFileBuffer(selectedFile);
		const report: any = await createReport({
			template,
			cmdDelimiter: ["{{", "}}"],
			data: {
				nama: "Sri Wahyuningsih Dianelo, S.Pd",
				nip: "198103022009012006",
				tanggal_lahir: "02 Maret 1981",
				pangkat: "Penata Tk. I (III/d)",
				jabatan:
					"Guru Muda Bidang Studi Bahasa Inggris, pada MTsN 2 Boalemo Kabupaten Boalemo",
				nomor_dokumen: "6538/Kw.30/1-c/KP.01/11/2022",
			},
			errorHandler: (err, command_code) => {
				console.log(err, command_code);

				return "command failed!";
			},
		});
		console.log(report);
		const blob = new Blob([report], {
			type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		});

		setGeneratedFile(blob);
		// saveDataToFile(
		// 	report,
		// 	"report.docx",
		// 	"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		// );
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
			<br />
			<br />
			<br />
			<br />
			<button className="p-2 m-2 bg-green-800 rounded" onClick={handleGenerate}>
				Generate
			</button>
			{generatedFile && (
				<a href={URL.createObjectURL(generatedFile)} download={generatedFile}>
					Download
				</a>
			)}
		</div>
	);
}
