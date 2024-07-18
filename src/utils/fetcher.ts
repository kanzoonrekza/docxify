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
		headers: {},
	};

	if (method !== "GET") {
		options.body = arg instanceof FormData ? arg : JSON.stringify(arg);
	}

	return fetch(url, options)
		.then(async (r) => {
			let errorBody;

			if (r.status === 404 || r.status === 500) {
				try {
					errorBody = await r.json();
				} catch (e) {
					errorBody = {};
				}
			}

			if (r.status === 404) {
				const error: Error & { status?: number; body?: any } = new Error(
					"URL Not Found"
				);
				error.status = r.status;
				error.body = errorBody;
				throw error;
			}
			if (r.status === 500) {
				const error: Error & { status?: number; body?: any } = new Error(
					"Internal Server Error"
				);
				console.log(errorBody);

				error.status = r.status;
				error.body = errorBody;
				throw error;
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
