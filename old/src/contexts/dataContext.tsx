import { templateDetailType } from "@/types";
import React from "react";

export const DataContext = React.createContext<{
	data: templateDetailType | undefined;
	mutate: () => void;
	isLoading: boolean;
	error: Error | undefined;
}>({ data: undefined, mutate: () => {}, isLoading: false, error: undefined });

export const useData = () => React.useContext(DataContext);
