"use client";
import { readFileBuffer } from "@/utils/docs-templates";
import { listCommands } from "docx-templates";
import React, { use } from "react";

export const ContextSelectedFile = React.createContext<{
	selectedFile: File | null;
	setSelectedFile: (file: File | null) => void;
	selectedTags: object[] | null;
	setSelectedTags: (tags: object[] | null) => void;
}>(undefined as any);

export const ContextProviderSelectedFile = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
	const [selectedTags, setSelectedTags] = React.useState<object[] | null>([]);

	React.useEffect(() => {
		const getTemplateTags = async () => {
			if (!selectedFile) return;
			const fileBuffer = await readFileBuffer(selectedFile);

			try {
				const res = await listCommands(fileBuffer as ArrayBuffer, ["{{", "}}"]);
				setSelectedTags(res);
				return res;
			} catch (e) {
				console.log(e);
				return e;
			}
		};

		getTemplateTags();
	}, [selectedFile]);

	return (
		<ContextSelectedFile.Provider
			value={{ selectedFile, setSelectedFile, selectedTags, setSelectedTags }}
		>
			{children}
		</ContextSelectedFile.Provider>
	);
};
