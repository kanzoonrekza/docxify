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
	api: apiDataType | undefined;
};

export type apiDataType = {
	api_link: string;
	api_params: string[];
	api_data: {
		[key: string]: string;
	};
	api_connected_tags: {
		[key: string]: string;
	};
};
