import FormTemplate from "./(components)/formTemplate";
import UploadFile from "../../../../../components/uploadFile";
import { ContextProviderSelectedFile } from "@/contexts/selectedFile";

export default function AddTemplate({
	params,
}: {
	params: { orgslug: number };
}) {
	return (
		<main className="flex flex-col gap-10">
			<h1 className="text-3xl font-bold">Create New Template</h1>
			<div className="flex h-full gap-5">
				<ContextProviderSelectedFile>
					<UploadFile />
					<FormTemplate orgid={params.orgslug} />
				</ContextProviderSelectedFile>
			</div>
		</main>
	);
}
