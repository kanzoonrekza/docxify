"use client";
import { DataContext } from "@/contexts/dataContext";
import { templateDetailType } from "@/types";
import fetcher from "@/utils/fetcher";
import React from "react";
import useSWR, { SWRResponse } from "swr";

export default function DetailTemplateLayout({
	params,
	children,
}: Readonly<{
	params: { slug: number };
	children: React.ReactNode;
}>) {
	const {
		data,
		error,
		isLoading,
		mutate,
	}: SWRResponse<templateDetailType, Error> = useSWR(
		"/api/core/templates/" + params.slug,
		fetcher.get
	);

	return (
		<DataContext.Provider value={{ data, mutate, error, isLoading }}>
			<div className="flex flex-col">{children}</div>
		</DataContext.Provider>
	);
}
