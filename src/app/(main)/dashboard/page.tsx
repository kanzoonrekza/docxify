import { mockTemplateDetails } from "@/mocks";
import { templateDetailType } from "@/types";
import Link from "next/link";

export default function Dashboard() {
	const templatesData: templateDetailType[] = mockTemplateDetails;

	return (
		<main className="p-10 flex flex-col gap-10">
			<div className="flex items-center justify-between ">
				<div className="text-4xl">All Templates</div>
				<Link href={"/templates/add"} className="bg-slate-700 p-2 rounded-md">
					Add New Template
				</Link>
			</div>
			<div className="grid grid-cols-4 gap-5">
				{templatesData.map((template) => (
					<Link
						href={`/template/${template.id}`}
						key={template.id}
						className="border p-3 rounded-lg"
					>
						<div className="flex items-center justify-start h-10 gap-3 mb-4">
							<div className="aspect-square bg-slate-600 h-full grid place-content-center rounded">
								T
							</div>
							<div className="flex-grow">
								<div>{template.title}</div>
								<div className="text-sm">{`${template.category} ${
									template.apiReady ? "- Api Ready" : ""
								} `}</div>
							</div>
						</div>
						<p className="line-clamp-3">{template.description}</p>
					</Link>
				))}
			</div>
		</main>
	);
}
