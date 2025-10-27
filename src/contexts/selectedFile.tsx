"use client";
import { readFileBuffer } from "@/utils/docs-templates";
import { listCommands } from "docx-templates";
import React from "react";

export const ContextSelectedFile = React.createContext<{
	selectedFile: File | null;
	setSelectedFile: (file: File | null) => void;
	selectedTags: object[] | null;
	setSelectedTags: (tags: object[] | null) => void;
	tagsStatus: { status: "Success" | "Error"; message: string } | null;
}>(undefined as any);

const tagFilterForLoop = (tags: any) => {
	const filteredTags = [];
	let errMessage = "";
	let loopObject: any | null = null;
	console.log("masuk");

	for (let i = 0; i < tags.length; i++) {
		const tag = tags[i];
		console.log(i, loopObject, tag);

		if (tag.type === "END-FOR" && !loopObject) {
			errMessage =
				"Mismatched END-FOR: expected ${FOR} but got ${END-FOR}";
		}

		// Normal tags
		if (!tag.code.startsWith("$") && tag.type === "INS") {
			filteredTags.push(tag);
			continue;
		}

		// Start a new loop, retain the FOR tag
		if (tag.type === "FOR") {
			console.log("INI DISINI");

			loopObject = {
				...tag,
				code: tag.code.split(" ")[2],
				loopCode: tag.code.split(" ")[0],
				object: [],
			};
			console.log(`$${loopObject?.loopCode}`);
		}

		if (
			loopObject &&
			tag.type === "INS" &&
			tag.code.startsWith(`$${loopObject?.loopCode}`)
		) {
			loopObject.object.push(tag.code.split(".")[1]);
		}

		// End the current loop, add the looped items to the FOR tag
		if (tag.type === "END-FOR" && loopObject) {
			filteredTags.push({ ...loopObject, loopCode: undefined });
			loopObject = null;
		}
	}
	return filteredTags;
};

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
		const rawTags = await listCommands(fileBuffer as ArrayBuffer, [
			"{{",
			"}}",
		]);

		// Returning error if no tags detected
		if (rawTags.length == 0) {
			setSelectedTags(rawTags);
			setTagsStatus({
				status: "Error",
				message:
					"No tags detected. Please make sure you have at least one tag in your document.",
			});
			return;
		}

		console.log("there is tags");

		const uniqueTags = rawTags.filter(
			(tag: any, index: number, self: any[]) =>
				self.findIndex((t) => t.code === tag.code) === index
		);

		// Returning error if there are empty tags detected, indicating invalid tags. An error will occur when trying to render the template.
		if (uniqueTags.some((item) => item.code === "")) {
			setSelectedTags(uniqueTags);
			setTagsStatus({
				status: "Error",
				message:
					"Empty tag detected. Please make sure all tags in your document are valid.",
			});
			return;
		}
		console.log("no empty tags");

		const loopFilteredTags = tagFilterForLoop(uniqueTags);

		setTagsStatus({ status: "Success", message: "All tags are valid!" });
		setSelectedTags(loopFilteredTags);
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
