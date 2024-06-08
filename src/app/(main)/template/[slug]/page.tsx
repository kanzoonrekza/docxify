import { apiData, mockTemplateDetails } from "@/mocks";
import React from "react";

export default function TemplateSlugPage({
	params,
}: {
	params: { slug: number };
}) {
	const data = mockTemplateDetails.find(
		(template) => template.id == params.slug
	);

	return (
		<div>
			<div>{data?.title}</div>
			<div>{data?.description}</div>
		</div>
	);
}
