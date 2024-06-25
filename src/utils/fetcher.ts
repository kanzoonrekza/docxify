type OtherFetcher = <T extends object | FormData>(
	url: string,
	options: { arg: T }
) => Promise<any>;

type Fetcher = {
	get: (url: string) => Promise<any>;
	post: OtherFetcher;
	patch: OtherFetcher;
	delete: OtherFetcher;
};

const makeRequest = async <T>(url: string, method: string, arg?: T) => {
	const options: RequestInit = {
		method: method,
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (method !== "GET") {
		options.body = arg instanceof FormData ? arg : JSON.stringify(arg);
	}

	return fetch(url, options)
		.then((r) => {
			if (r.status === 404) {
				throw new Error("URL Not Found");
			}
			if (r.status === 500) {
				throw new Error("Internal Server Error");
			}

			const contentType = r.headers.get("Content-Type");

			if (contentType && contentType.includes("application/json")) {
				return r.json();
			} else if (contentType && contentType.includes("application/pdf")) {
				return r.blob();
			}
		})
		.catch((e) => {
			console.error(`Error in fetcher.${method.toLowerCase()}:`, e);
			throw e;
		});
};

export const fetcher: Fetcher = {
	get: async (url: string) => {
		return makeRequest(url, "GET");
	},

	post: async (url: string, { arg }: { arg: object | FormData }) => {
		return makeRequest(url, "POST", arg);
	},

	patch: async (url: string, { arg }: { arg: object | FormData }) => {
		return makeRequest(url, "PATCH", arg);
	},

	delete: async (url: string, { arg }: { arg: object | FormData }) => {
		return makeRequest(url, "DELETE", arg);
	},
};

export default fetcher;
