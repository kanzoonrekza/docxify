export type TypeFormField = {
	name: string;
	label: string;
	required?: boolean;
	readonly?: boolean;
	type?: string;
	value?: string;
	defaultValue?: string;
	status?: "Success" | "Error";
	footnote?: string;
};
export const FormField = ({ item }: { item: TypeFormField }) => (
	<span key={item.name}>
		<label htmlFor={item.name} className="text-lg flex items-stretch gap-1">
			{item.label}
			{item.required && <span className="text-secondary text-sm">*</span>}
		</label>
		{item.type === "textarea" ? (
			<textarea
				id="tags"
				name="tags"
				className={`w-full rounded p-1 h-60 bg-base-100 ${
					item.status === "Error" && "border border-red-500 bg-red-950"
				} ${
					item.status === "Success" && "border border-green-500 bg-green-950"
				}`}
				defaultValue={item.defaultValue}
				value={item.value}
				readOnly
			/>
		) : (
			<input
				required={item.required}
				type={item.type || "text"}
				id={item.name}
				name={item.name}
				defaultValue={item.defaultValue}
				value={item.value}
				className="w-full rounded p-1 border border-base-300"
				readOnly={item.readonly}
			/>
		)}
		{item.footnote && (
			<aside
				className={`${
					item.status === "Error" ? "text-red-500" : "text-green-500"
				}`}
			>
				{item.footnote}
			</aside>
		)}
	</span>
);
