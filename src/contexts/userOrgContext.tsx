"use client";
import fetcher from "@/utils/fetcher";
import React from "react";
import useSWR from "swr";

export const UserOrgContext = React.createContext<{
	data: any | undefined;
	mutate: () => void;
	isLoading: boolean;
}>({ data: undefined, isLoading: true, mutate: () => {} });

export const useUserOrg = () => React.useContext(UserOrgContext);

export const ContextProviderUserOrg = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { data, error, isLoading, mutate } = useSWR(
		`/api/core/organizations`,
		fetcher.get
	);

	return (
		<UserOrgContext.Provider value={{ data, isLoading, mutate }}>
			{children}
		</UserOrgContext.Provider>
	);
};
