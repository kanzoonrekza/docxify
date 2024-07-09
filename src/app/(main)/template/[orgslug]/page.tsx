import Link from "next/link";
import TemplateList from "./templateList";

export default function TemplatePage({
	params,
}: {
	params: { orgslug: number };
}) {
	return (
		<main className="flex flex-col gap-10 p-10">
			<div className="flex items-center justify-between">
				<div className="text-4xl">All Templates</div>
				<Link href={`/template/${params.orgslug}/add`} className="p-2 rounded-md bg-slate-700">
					Add New Template
				</Link>
			</div>
			<TemplateList orgid={params.orgslug} />
		</main>
	);
}
