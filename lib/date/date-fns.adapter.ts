import {
  addDays,
  addMonths,
  addYears,
  differenceInDays,
  differenceInMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  type Locale,
} from "date-fns";

import type { DateProvider } from "./types";

const ISO_FORMAT = "yyyy-MM-dd";
const ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class DateFnsAdapter implements DateProvider {
  /**
   * "en-CA" produce "yyyy-MM-dd", el mismo formato del contrato.
   * Se construye una sola vez: instanciar Intl.DateTimeFormat es costoso.
   */
  readonly #todayFormatter: Intl.DateTimeFormat;

  constructor(
    public readonly locale: Locale,
    public readonly timeZone: string,
  ) {
    this.#todayFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  // ─── Interop con Date nativo ───
  toDate(input: string): Date {
    return parseISO(input);
  }

  fromDate(date: Date): string {
    return format(date, ISO_FORMAT);
  }

  // ─── Base ───
  /**
   * No usa `new Date()` + `format`: eso resolvería el día en el uso del proceso,
   * que en producción es UTC y adelanta la fecha para husos negativos.
   */
  today(): string {
    return this.#todayFormatter.format(new Date());
  }

  isValid(input: string): boolean {
    return ISO_REGEX.test(input) && isValid(parseISO(input));
  }

  format(date: string, formatStr: string): string {
    return format(this.toDate(date), formatStr, { locale: this.locale });
  }

  // ─── Manipulación ───
  addDays(date: string, amount: number): string {
    return this.fromDate(addDays(this.toDate(date), amount));
  }

  addMonths(date: string, amount: number): string {
    return this.fromDate(addMonths(this.toDate(date), amount));
  }

  addYears(date: string, amount: number): string {
    return this.fromDate(addYears(this.toDate(date), amount));
  }

  subDays(date: string, amount: number): string {
    return this.fromDate(subDays(this.toDate(date), amount));
  }

  subMonths(date: string, amount: number): string {
    return this.fromDate(subMonths(this.toDate(date), amount));
  }

  // ─── Extracción ───
  /** date-fns usa 0=domingo; aquí se normaliza a ISO (0=lunes, 6=domingo). */
  getDayOfWeek(date: string): number {
    const day = getDay(this.toDate(date));
    return day === 0 ? 6 : day - 1;
  }

  getDayOfMonth(date: string): number {
    return getDate(this.toDate(date));
  }

  getMonth(date: string): number {
    return getMonth(this.toDate(date));
  }

  getYear(date: string): number {
    return getYear(this.toDate(date));
  }

  // ─── Mes / semana (ISO: la semana empieza en lunes) ───
  getDaysInMonth(date: string): number {
    return getDaysInMonth(this.toDate(date));
  }

  startOfMonth(date: string): string {
    return this.fromDate(startOfMonth(this.toDate(date)));
  }

  endOfMonth(date: string): string {
    return this.fromDate(endOfMonth(this.toDate(date)));
  }

  startOfYear(date: string): string {
    return this.fromDate(startOfYear(this.toDate(date)));
  }

  startOfWeek(date: string): string {
    return this.fromDate(startOfWeek(this.toDate(date), { weekStartsOn: 1 }));
  }

  endOfWeek(date: string): string {
    return this.fromDate(endOfWeek(this.toDate(date), { weekStartsOn: 1 }));
  }

  // ─── Intervalos ───
  eachDayOfInterval(start: string, end: string): string[] {
    return eachDayOfInterval({
      start: this.toDate(start),
      end: this.toDate(end),
    }).map((date) => this.fromDate(date));
  }

  // ─── Comparación ───
  isBefore(date: string, dateToCompare: string): boolean {
    return isBefore(this.toDate(date), this.toDate(dateToCompare));
  }

  isAfter(date: string, dateToCompare: string): boolean {
    return isAfter(this.toDate(date), this.toDate(dateToCompare));
  }

  isSameDay(date: string, dateToCompare: string): boolean {
    return isSameDay(this.toDate(date), this.toDate(dateToCompare));
  }

  isSameMonth(date: string, dateToCompare: string): boolean {
    return isSameMonth(this.toDate(date), this.toDate(dateToCompare));
  }

  isToday(date: string): boolean {
    return date === this.today();
  }

  // ─── Diferencias ───
  differenceInDays(dateLeft: string, dateRight: string): number {
    return differenceInDays(this.toDate(dateLeft), this.toDate(dateRight));
  }

  differenceInMonths(dateLeft: string, dateRight: string): number {
    return differenceInMonths(this.toDate(dateLeft), this.toDate(dateRight));
  }
}
