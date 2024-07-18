import Link from "next/link";
import TemplateList from "./templateList";

export default function TemplatePage({
	params,
}: {
	params: { orgslug: number };
}) {
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="text-4xl">All Templates</div>
				<Link
					href={`/template/${params.orgslug}/add`}
					className="btn btn-wide btn-neutral"
				>
					Create Template
				</Link>
			</div>
			<TemplateList orgid={params.orgslug} />
		</>
	);
}
