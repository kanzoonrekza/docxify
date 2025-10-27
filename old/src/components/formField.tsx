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
		<label htmlFor={item.name} className="flex items-stretch gap-1">
			{item.label}
			{item.required && <span className="text-sm text-secondary">*</span>}
		</label>
		{item.type === "select" && (
			<select
				id={item.name}
				name={item.name}
				className="select select-sm w-full rounded border border-base-300 px-1"
				defaultValue={item.defaultValue}
			>
				<option value="member" selected>
					Member
				</option>
				<option value="admin">Admin</option>
			</select>
		)}
		{item.type === "textarea" && (
			<textarea
				id="tags"
				name="tags"
				className={`h-60 w-full rounded border border-base-300 bg-opacity-30 px-1 ${
					item.status === "Error" && "border border-error bg-error"
				} ${item.status === "Success" && "border border-success bg-success"}`}
				defaultValue={item.defaultValue}
				value={item.value}
				readOnly
			/>
		)}
		{item.type !== "textarea" && item.type !== "select" && (
			<input
				required={item.required}
				type={item.type || "text"}
				id={item.name}
				name={item.name}
				defaultValue={item.defaultValue}
				value={item.value}
				className="w-full rounded border border-base-300 px-1"
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
