export type TypeFormField = {
	name: string;
	label: string;
	required?: boolean;
};
export const FormField = ({ item }: { item: TypeFormField }) => (
	<span key={item.name}>
		<label htmlFor={item.name} className="text-lg">
			{item.label}
		</label>
		<input
			required={item.required}
			type="text"
			id={item.name}
			name={item.name}
			className="w-full bg-gray-800 rounded p-1"
		/>
	</span>
);
