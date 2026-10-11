import { tableFeatures } from "@tanstack/react-table";

// Core features only: the table is read-only, without sorting, filtering or pagination.
export const features = tableFeatures({});

export type DataTableFeatures = typeof features;
