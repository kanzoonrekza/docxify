import { FormField } from "@/components/formField";
import fetcher from "@/utils/fetcher";
import useSWRMutation from "swr/mutation";

export default function AddMemberModal({
	orgid,
	onClose,
}: {
	orgid: number;
	onClose: () => void;
}) {
	const { trigger, isMutating, error } = useSWRMutation(
		`/api/core/organizations/${orgid}/members`,
		fetcher.post,
		{
			onError: (error, variables, context) =>
				console.error(error, context, variables),
			onSuccess: (data, variables, context) => {
				// @ts-ignore
				document.getElementById("add-organization-member").reset();
				onClose();
			},
		}
	);

	const handleSUbmit = (e: any) => {
		e.preventDefault();

		const formData: FormData = new FormData(e.currentTarget);

		trigger(formData);
	};
	return (
		<form
			id="add-organization-member"
			onSubmit={handleSUbmit}
			className="flex flex-col gap-3 max-w-2xl w-full"
		>
			<h3 className="font-bold text-lg">Invite New Member</h3>
			<FormField
				item={{
					label: "Username",
					type: "text",
					name: "username",
					required: true,
				}}
			/>
			<FormField
				item={{
					label: "Role",
					type: "select",
					name: "role",
					required: true,
				}}
			/>
			<button className="btn btn-sm btn-neutral ml-auto" disabled={isMutating}>
				{isMutating ? <span className="loading loading-dots" /> : "Invite"}
			</button>
			{error && !isMutating && (
				<div className="text-red-500 text-center text-sm pt-1">
					{error?.body?.error?.detail?.includes("is not present")
						? "Username does not exist. Please check the username spelling and try again."
						: "An error occurred. Try again later or contact support."}
				</div>
			)}
		</form>
	);
}
