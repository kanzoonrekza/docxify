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
			.upload_stream(
				{
					resource_type: "auto",
					folder: "docxify",
					public_id: `${Date.now()}_${file.name}`,
				},
				onDone
			)
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

export const getFileFromCloudinary = async (
	url: string
): Promise<File | undefined> => {
	const rawFile = await fetch(url);
	const blob = await rawFile.blob();
	const file = new File([blob], "document.docx", { type: blob.type });
	return file;
};
