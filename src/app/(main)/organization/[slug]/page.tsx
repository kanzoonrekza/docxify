"use client";
import Modal from "@/components/modal";
import { useUserOrg } from "@/contexts/userOrgContext";
import fetcher from "@/utils/fetcher";
import useSWR, { SWRResponse } from "swr";
import AddMemberModal from "./modals/addMember";
import EditMemberModal from "./modals/editMember";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";

export default function OrganizationPage({
	params,
}: {
	params: { slug: number };
}) {
	const router = useRouter();
	const {
		data: dataOrg,
		error,
		isLoading: isLoadingOrg,
		mutate: mutateOrg,
	}: SWRResponse<any, Error> = useSWR(
		"/api/core/organizations/" + params.slug,
		fetcher.get
	);

	const { data, isLoading } = useUserOrg();

	const current = data?.filter(
		(org: any) => org.id === Number(params.slug)
	)[0];

	const { trigger: triggerDelete, isMutating: isMutatingDelete } =
		useSWRMutation(
			"/api/core/organizations/" + params.slug,
			fetcher.delete,
			{
				onError: (error, variables, context) =>
					console.error(error, context, variables),
				onSuccess: () => router.push("/dashboard"),
			}
		);

	return (
		<main className="flex flex-col gap-10 p-10">
			<div className="flex flex-col">
				<aside className="font-bold">Organization</aside>
				{isLoading ? (
					<div className="skeleton h-10 w-80" />
				) : (
					<h1 className="text-4xl">{current.name}</h1>
				)}
			</div>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{isLoading ? (
					<>
						<div className="skeleton h-36 w-full" />
						<div className="skeleton h-36 w-full" />
					</>
				) : (
					<>
						<div className="card card-bordered">
							<div className="card-body">
								<h3 className="card-title font-normal">
									Total Templates
								</h3>
								<span className="text-3xl font-black">
									{current.templateCount}
								</span>
							</div>
						</div>
						<div className="card card-bordered">
							<div className="card-body">
								<h3 className="card-title font-normal">
									Connected API Templates
								</h3>
								<span className="text-3xl font-black">
									{current.connectedTemplateCount}
								</span>
							</div>
						</div>
					</>
				)}
				{isLoadingOrg ? (
					<div className="skeleton h-36 w-full" />
				) : (
					<div className="card card-bordered">
						<div className="card-body">
							<h3 className="card-title font-normal">
								Total Organization Members
							</h3>
							<span className="text-3xl font-black">
								{dataOrg.length || 0}
							</span>
						</div>
					</div>
				)}
			</div>
			<div>
				<div className="flex justify-between items-center mb-1">
					<h2 className="font-bold text-xl">Members</h2>
					{!isLoading &&
						["admin", "owner"].includes(current.role) && (
							<Modal.Button
								id="add-organization-member"
								className="btn btn-sm btn-outline"
							>
								Add Member
							</Modal.Button>
						)}
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border border-neutral">
						<thead className="bg-neutral text-neutral-content">
							<tr>
								<th className="text-start px-2 py-1">
									Username
								</th>
								<th className="text-start px-2 py-1">Email</th>
								<th className="text-start px-2 py-1">Role</th>
								<th className="text-start px-2 py-1 w-0"></th>
							</tr>
						</thead>
						<tbody>
							{isLoadingOrg &&
								[...Array(3)].map((_, index) => (
									<tr key={index}>
										<td className="p-1">
											<div className="skeleton h-6" />
										</td>
										<td className="p-1">
											<div className="skeleton h-6" />
										</td>
										<td className="p-1">
											<div className="skeleton h-6" />
										</td>
										<td className="p-1 w-min">
											<div className="skeleton h-6" />
										</td>
									</tr>
								))}
							{!isLoadingOrg &&
								dataOrg.map((member: any) => (
									<tr
										key={member.username}
										className="hover:bg-base-200"
									>
										<td className="px-2">
											{member.username}
										</td>
										<td className="px-2">{member.email}</td>
										<td className="px-2">{member.role}</td>
										<td className="px-5 w-0">
											<Modal.Button
												id={`edit-organization-member-${member.username}`}
												className="btn btn-square btn-ghost btn-sm grid disabled:btn-ghost disabled:opacity-20"
												disabled={
													member?.role === "owner" ||
													(current?.role ===
														"admin" &&
														member?.role ===
															"admin")
												}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="30"
													height="30"
													fill="#000000"
													viewBox="0 0 256 256"
												>
													<path d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z"></path>
												</svg>
											</Modal.Button>
										</td>
										<Modal
											id={`edit-organization-member-${member.username}`}
										>
											<EditMemberModal
												orgid={params.slug}
												data={member}
												onClose={() => {
													// @ts-ignore
													document
														.getElementById(
															`edit-organization-member-${member.username}`
														)
														// @ts-ignore
														.close();

													mutateOrg();
												}}
											/>
										</Modal>
									</tr>
								))}
						</tbody>
					</table>
				</div>
				<Modal id="add-organization-member">
					<AddMemberModal
						orgid={params.slug}
						onClose={() => {
							// @ts-ignore
							document
								.getElementById("add-organization-member")
								.close();

							mutateOrg();
						}}
					/>
				</Modal>
			</div>
			{current?.role === "owner" && (
				<div>
					<h2 className="font-bold text-xl">Delete Organization</h2>
					<aside>
						Please be careful, this action is irreversible.
						<br />
						You must delete all templates before deleting
						organization.
					</aside>
					<button
						className="btn btn-error btn-wide mt-5"
						disabled={
							current?.templateCount > 0 || isMutatingDelete
						}
						onClick={() => {
							triggerDelete({});
						}}
					>
						{isMutatingDelete ? (
							<span className="loading loading-dots" />
						) : (
							"Permanently Delete Organization"
						)}
					</button>
				</div>
			)}
		</main>
	);
}
