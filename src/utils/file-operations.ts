import {
	UploadApiErrorResponse,
	UploadApiResponse,
	v2 as cloudinary,
} from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const claudinaryUploadBuffer = async (
	file: File
): Promise<UploadApiResponse> => {
	const buffer = await file.arrayBuffer();

	return await new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ resource_type: "auto", folder: "docxify" }, onDone)
			.end(Buffer.from(buffer));

		function onDone(
			error: UploadApiErrorResponse | undefined,
			result: UploadApiResponse | undefined
		) {
			if (error) {
				return reject(error);
			}
			if (result) {
				return resolve(result);
			} else {
				return reject(error);
			}
		}
	});
};
