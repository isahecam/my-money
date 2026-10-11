import { es } from "date-fns/locale";

import { APP_TIMEZONE } from "@/lib/constants";

import { DateFnsAdapter } from "./date-fns.adapter";

export * from "./types";

export const dt = new DateFnsAdapter(es, APP_TIMEZONE);
