"use client";
import fetcher from "@/utils/fetcher";
import React from "react";
import useSWR from "swr";

export const UserOrgContext = React.createContext<{
	data: any | undefined;
	mutate: () => void;
	error: boolean;
	isLoading: boolean;
}>({ data: undefined, isLoading: true, error: false, mutate: () => {} });

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
		<UserOrgContext.Provider value={{ data, isLoading, error, mutate }}>
			{children}
		</UserOrgContext.Provider>
	);
};
