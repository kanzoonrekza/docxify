"use client";
import { templateDetailType } from "@/types";
import fetcher from "@/utils/fetcher";
import React from "react";
import useSWR, { SWRResponse } from "swr";

const DataContext = React.createContext<templateDetailType | undefined>(
	undefined
);

export const useData = () => React.useContext(DataContext);

export default function DetailTemplateLayout({
	params,
	children,
}: Readonly<{
	params: { slug: number };
	children: React.ReactNode;
}>) {
	const { data, error, isLoading }: SWRResponse<templateDetailType, Error> =
		useSWR("/api/templates/" + params.slug, fetcher.get, {});

	if (error) return <div>failed to load</div>;
	if (isLoading) return <div>loading...</div>;

	return (
		<DataContext.Provider value={data}>
			<div className="h-screen flex flex-col">{children}</div>
		</DataContext.Provider>
	);
}
