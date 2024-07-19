"use client";
import { useUserOrg } from "@/contexts/userOrgContext";
import fetcher from "@/utils/fetcher";
import React from "react";
import useSWR, { SWRResponse } from "swr";

export default function OrganizationPage({
	params,
}: {
	params: { slug: number };
}) {
	const {
		data: dataOrg,
		error,
		isLoading: isLoadingOrg,
		mutate,
	}: SWRResponse<any, Error> = useSWR(
		"/api/core/organizations/" + params.slug,
		fetcher.get
	);

	const { data, isLoading } = useUserOrg();

	const current = data?.filter((org: any) => org.id === Number(params.slug))[0];

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
						<div className="skeleton h-28 w-full" />
						<div className="skeleton h-28 w-full" />
					</>
				) : (
					<>
						<div className="card card-bordered">
							<div className="card-body">
								<h3 className="card-title font-normal">Total Templates</h3>
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
					<div className="skeleton h-28 w-full" />
				) : (
					<div className="card card-bordered">
						<div className="card-body">
							<h3 className="card-title font-normal">
								Total Organization Members
							</h3>
							<span className="text-3xl font-black">{dataOrg.length || 0}</span>
						</div>
					</div>
				)}
			</div>
			<div>
				<div className="flex justify-between items-center mb-1">
					<h2 className="font-bold text-xl">Members</h2>
					<button className="btn btn-sm btn-outline" onClick={() => {}}>
						Add Member
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border border-neutral">
						<thead className="bg-neutral text-neutral-content">
							<tr>
								<th className="text-start px-2 py-1">Username</th>
								<th className="text-start px-2 py-1">Email</th>
								<th className="text-start px-2 py-1">Role</th>
								<th className="text-start px-2 py-1"></th>
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
										<td className="p-1">
											<div className="skeleton h-6" />
										</td>
									</tr>
								))}
							{!isLoadingOrg &&
								dataOrg.map((member: any) => (
									<tr key={member.username} className="hover:bg-base-200">
										<td className="px-2">{member.username}</td>
										<td className="px-2">{member.email}</td>
										<td className="px-2">{member.role}</td>
										<td className="px-2 text-center">action</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}
