import { rowPaginationFeature, tableFeatures } from "@tanstack/react-table";

// Manual pagination only: the server sends the requested page. No sorting or filtering yet.
export const features = tableFeatures({ rowPaginationFeature });

export type DataTableFeatures = typeof features;
