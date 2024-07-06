import { templateDetailType } from "@/types";
import React from "react";

export const DataContext = React.createContext<{
	data: templateDetailType | undefined;
	mutate: () => void;
}>({ data: undefined, mutate: () => {} });

export const useData = () => React.useContext(DataContext);