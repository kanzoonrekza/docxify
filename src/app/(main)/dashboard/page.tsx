import { mockTemplateDetails } from "@/mocks";
import { templateDetailType } from "@/types";
import Link from "next/link";

export default function Dashboard() {
	const templatesData: templateDetailType[] = mockTemplateDetails;

	return (
		<main>
			<div className="flex items-center justify-between">
				<div>Templates</div>
				<button className="bg-slate-700">Add New Template</button>
			</div>
			<div className="grid grid-cols-4 gap-5">
				{templatesData.map((template) => (
					<div className="border p-2 rounded-lg">
						<div className="flex items-center justify-start h-10 gap-4">
							<div className="aspect-square bg-slate-600 h-full grid place-content-center">
								G
							</div>
							<div className="flex-grow">
								<Link href={`/template/${template.id}`} key={template.id}>
									{template.title}
								</Link>
								<div>{`${template.category} ${
									template.apiReady ? "- Api Ready" : ""
								} `}</div>
							</div>
							<button className="bg-red-500 h-full px-2">:</button>
						</div>
						<p>{template.description}</p>
						<div className="grid grid-cols-2 gap-2">
							<button>Edit</button>
							<button className="bg-slate-500">Generate</button>
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
