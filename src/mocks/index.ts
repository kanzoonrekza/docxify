import { templateDetailType } from "@/types";

export const mockTemplateDetails: templateDetailType[] = [
	{
		id: 1,
		title: "Template A",
		description: "Description of template A",
		category: "General",
		apiReady: true,
		tags: [
			{ raw: "INS some_variable", code: "some_variable", type: "INS" },
			{ raw: "INS some_variable", code: "some_variableb", type: "INS" },
			{ raw: "IMAGE svgImgFile()", code: "svgImgFile()", type: "IMAGE" },
		],
		api: {
			url: "https://api.example.com/template/1",
			dataTag: [
				{ docxTagCode: "some_variable", docxTagValue: "data.variablea" },
				{ docxTagCode: "some_variableb", docxTagValue: "data.variableb" },
			],
		},
	},
	{
		id: 2,
		title: "Template B",
		description: "Description of template B",
		category: "General",
		apiReady: false,
		tags: [
			{ raw: "INS some_variable", code: "some_variable", type: "INS" },
			{ raw: "INS some_variable", code: "some_variableb", type: "INS" },
			{ raw: "IMAGE svgImgFile()", code: "svgImgFile()", type: "IMAGE" },
		],
		api: undefined,
	},
	{
		id: 3,
		title: "Template M",
		description: "Description of template M. It's a long description that will be truncated, and it will be truncated, but we don't know how long it will be.",
		category: "General",
		apiReady: false,
		tags: [
			{ raw: "INS some_variable", code: "some_variable", type: "INS" },
			{ raw: "INS some_variable", code: "some_variableb", type: "INS" },
			{ raw: "IMAGE svgImgFile()", code: "svgImgFile()", type: "IMAGE" },
		],
		api: undefined,
	},
	{
		id: 4,
		title: "Template B",
		description: "Description of template B",
		category: "General",
		apiReady: false,
		tags: [
			{ raw: "INS some_variable", code: "some_variable", type: "INS" },
			{ raw: "INS some_variable", code: "some_variableb", type: "INS" },
			{ raw: "IMAGE svgImgFile()", code: "svgImgFile()", type: "IMAGE" },
		],
		api: undefined,
	},
];

export const apiData: any = {
	data: {
		variablea: "some value of a variable",
		variableb: "anothervalue of a variable",
		nestedData: {
			nestedVariable: "anothervalue of a variable",
			anotherVariable: "some value of different variable",
		},
	},
};
