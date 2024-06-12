export type templateDetailType = {
	id: number;
	title: string;
	fileUrl: string;
	file: File;
	description: string;
	category: string;
	tags: {
		raw: string;
		code: string;
		type: string;
	}[];
	apiReady: boolean;
	api:
		| {
				url: string;
				dataTag: { docxTagCode: string; docxTagValue: string }[];
		  }
		| undefined;
};
