import { FormField } from "@/components/formField";
import fetcher from "@/utils/fetcher";
import React from "react";
import useSWRMutation from "swr/mutation";

export default function EditMemberModal({
	orgid,
	data,
	onClose,
}: {
	orgid: number;
	data: any;
	onClose: () => void;
}) {
	const {
		trigger: changeRole,
		isMutating: changeRoleLoading,
		error,
	} = useSWRMutation(
		`/api/core/organizations/${orgid}/members`,
		fetcher.patch,
		{
			onError: (error, variables, context) =>
				console.error(error, context, variables),
			onSuccess: (result, variables, context) => {
				onClose();
			},
		}
	);
	const handleSubmit = (e: any) => {
		e.preventDefault();

		const formData: FormData = new FormData(e.currentTarget);
		formData.set("username", data.username);

		changeRole(formData);
	};

	return (
		<div className="grid gap-10">
			<form
				id={`edit-organization-member-${data.username}`}
				onSubmit={handleSubmit}
				className="flex flex-col gap-3 max-w-2xl w-full"
			>
				<h3 className="font-bold text-lg">Edit {data.username}</h3>
				<FormField
					item={{
						label: "Role",
						type: "select",
						name: "role",
						required: true,
						defaultValue: data.role,
					}}
				/>

				<button
					className="btn btn-sm btn-neutral ml-auto"
					disabled={changeRoleLoading}
				>
					{changeRoleLoading ? (
						<span className="loading loading-dots" />
					) : (
						"Change Role"
					)}
				</button>
			</form>
			<button className="btn btn-outline btn-error btn-sm btn-block bg-error bg-opacity-20">
				Remove Member
			</button>
		</div>
	);
}
