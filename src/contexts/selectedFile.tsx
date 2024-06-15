"use client";
import { readFileBuffer } from "@/utils/docs-templates";
import { listCommands } from "docx-templates";
import React, { use } from "react";

export const ContextSelectedFile = React.createContext<{
	selectedFile: File | null;
	setSelectedFile: (file: File | null) => void;
	selectedTags: object[] | null;
	setSelectedTags: (tags: object[] | null) => void;
	tagsStatus: { status: "Success" | "Error"; message: string } | null;
}>(undefined as any);

export const ContextProviderSelectedFile = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
	const [selectedTags, setSelectedTags] = React.useState<object[] | null>([]);
	const [tagsStatus, setTagsStatus] = React.useState<{
		status: "Success" | "Error";
		message: string;
	} | null>(null);

	const getTemplateTags = async (file: File) => {
		if (!file) return;
		const fileBuffer = await readFileBuffer(file);
		const rawTags = await listCommands(fileBuffer as ArrayBuffer, ["{{", "}}"]);

		const uniqueTags = rawTags.filter(
			(tag: any, index: number, self: any[]) =>
				self.findIndex((t) => t.code === tag.code) === index
		);

		if (uniqueTags.length < 0) {
			setTagsStatus({ status: "Error", message: "No tags detected" });
		} else if (uniqueTags.some((item) => item.code === "")) {
			setTagsStatus({ status: "Error", message: "Empty tag detected" });
		} else {
			setTagsStatus({ status: "Success", message: "All tags are valid!" });
		}
		setSelectedTags(uniqueTags);
	};

	React.useEffect(() => {
		getTemplateTags(selectedFile as File);
	}, [selectedFile]);

	return (
		<ContextSelectedFile.Provider
			value={{
				selectedFile,
				setSelectedFile,
				selectedTags,
				setSelectedTags,
				tagsStatus,
			}}
		>
			{children}
		</ContextSelectedFile.Provider>
	);
};
