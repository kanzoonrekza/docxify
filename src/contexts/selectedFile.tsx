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

	const getTemplateTags = async (file: File) => {
		if (!selectedFile) return;
		const fileBuffer = await readFileBuffer(selectedFile);
		const rawTags = await listCommands(fileBuffer as ArrayBuffer, ["{{", "}}"]);

		const uniqueTags = rawTags.filter(
			(tag: any, index: number, self: any[]) =>
				self.findIndex((t) => t.code === tag.code) === index
		);
		setSelectedTags(uniqueTags);
	};

	React.useEffect(() => {
		getTemplateTags(selectedFile as File);
	}, [selectedFile]);

	return (
		<ContextSelectedFile.Provider
			value={{ selectedFile, setSelectedFile, selectedTags, setSelectedTags }}
		>
			{children}
		</ContextSelectedFile.Provider>
	);
};
