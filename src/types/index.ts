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
	api_url: string | undefined;
	api_connected_tags: {
		[key: string]: string;
	};
	api_param: string[];
	secret: string;
	role?: string;
};
