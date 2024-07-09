import FormTemplate from "./(components)/formTemplate";
import UploadFile from "../../../../../components/uploadFile";
import { ContextProviderSelectedFile } from "@/contexts/selectedFile";

export default function AddTemplate({
	params,
}: {
	params: { orgslug: number };
}) {
	return (
		<main className="flex flex-col gap-5 p-10 h-full">
			<h1 className="text-5xl font-medium mb-5">Add New Template</h1>
			<div className="grid grid-cols-2 gap-5 h-full">
				<ContextProviderSelectedFile>
					<UploadFile />
					<FormTemplate orgid={params.orgslug} />
				</ContextProviderSelectedFile>
			</div>
		</main>
	);
}
