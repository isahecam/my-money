import type { Locale } from "date-fns";

/**
 * Proveedor de fechas de la aplicación.
 *
 * CONTRATO: todas las fechas —parámetros y retornos— son strings ISO
 * "yyyy-MM-dd" sin hora ni zona horaria. Nunca objetos `Date`.
 *
 * El "hoy" se resuelve en `timeZone`, no en el uso del proceso: el servidor
 * corre en UTC y adelantaría la fecha para usos negativos.
 */
export interface DateProvider {
  /** Locale activo, para componentes de terceros que lo requieran (ej. date pickers). */
  readonly locale: Locale;

  /** Zona horaria de referencia para resolver "hoy". @example "America/Mexico_City" */
  readonly timeZone: string;

  // ─── Base ───
  /** Fecha de hoy en `timeZone`. @returns "2026-07-25" */
  today(): string;

  /** true si el string tiene formato "yyyy-MM-dd" y representa una fecha real. */
  isValid(input: string): boolean;

  /**
   * Formatea con patrones de date-fns, aplicando el locale del adapter.
   * @throws RangeError con fechas inválidas; validar antes con isValid
   * @example format("2026-07-25", "LLLL, yyyy") → "julio, 2026"
   */
  format(date: string, formatStr: string): string;

  // ─── Manipulación (devuelven una fecha nueva; no mutan) ───
  addDays(date: string, amount: number): string;
  addMonths(date: string, amount: number): string;
  addYears(date: string, amount: number): string;
  subDays(date: string, amount: number): string;
  subMonths(date: string, amount: number): string;

  // ─── Extracción ───
  /**
   * Día de la SEMANA, normalizado a ISO 8601.
   * @returns 0=lunes, 1=martes, 2=miércoles, 3=jueves, 4=viernes, 5=sábado, 6=domingo
   * @see getDayOfMonth para el número del día (1-31)
   */
  getDayOfWeek(date: string): number;

  /**
   * Día del MES.
   * @returns 1-31
   * @see getDayOfWeek para el día de la semana
   * @example getDayOfMonth("2026-07-25") → 25
   */
  getDayOfMonth(date: string): number;

  /** Mes del año. @returns 0=enero … 11=diciembre */
  getMonth(date: string): number;

  /** Año completo. @returns 2026 */
  getYear(date: string): number;

  // ─── Mes / semana (ISO: la semana empieza en lunes) ───
  /** Días que tiene el mes de esa fecha. @returns 28-31 */
  getDaysInMonth(date: string): number;

  /** @example startOfMonth("2026-07-25") → "2026-07-01" */
  startOfMonth(date: string): string;

  /** @example endOfMonth("2026-07-25") → "2026-07-31" */
  endOfMonth(date: string): string;

  /** @example startOfYear("2026-07-25") → "2026-01-01" */
  startOfYear(date: string): string;

  /** Lunes de esa semana. @example startOfWeek("2026-07-25") → "2026-07-20" */
  startOfWeek(date: string): string;

  /** Domingo de esa semana. @example endOfWeek("2026-07-25") → "2026-07-26" */
  endOfWeek(date: string): string;

  // ─── Intervalos ───
  /**
   * Todas las fechas entre start y end, ambas inclusive.
   * @throws RangeError si start es posterior a end
   */
  eachDayOfInterval(start: string, end: string): string[];

  // ─── Comparación ───
  /** true si `date` es estrictamente anterior a `dateToCompare`. */
  isBefore(date: string, dateToCompare: string): boolean;

  /** true si `date` es estrictamente posterior a `dateToCompare`. */
  isAfter(date: string, dateToCompare: string): boolean;

  /** true si ambas fechas son el mismo día. */
  isSameDay(date: string, dateToCompare: string): boolean;

  /** true si ambas fechas caen en el mismo mes del mismo año. */
  isSameMonth(date: string, dateToCompare: string): boolean;

  /** true si la fecha es hoy en `timeZone`. */
  isToday(date: string): boolean;

  // ─── Diferencias (dateLeft − dateRight; positivo si dateLeft es posterior) ───
  /** @example differenceInDays("2026-07-25", "2026-07-20") → 5 */
  differenceInDays(dateLeft: string, dateRight: string): number;

  /**
   * Meses COMPLETOS transcurridos (trunca, no redondea).
   * Normalizar ambos argumentos con startOfMonth para contar meses de calendario.
   * @example differenceInMonths("2026-09-01", "2026-07-01") → 2
   * @example differenceInMonths("2026-08-01", "2026-07-15") → 0
   */
  differenceInMonths(dateLeft: string, dateRight: string): number;

  // ─── Interop con Date nativo ───
  /**
   * Convierte un string ISO a `Date` nativo, en huso local.
   * Usar solo en el borde con librerías de terceros que exigen `Date` (ej. date pickers).
   */
  toDate(date: string): Date;

  /**
   * Convierte un `Date` nativo a string ISO "yyyy-MM-dd", en huso local.
   * Usar solo en el borde con librerías de terceros que exigen `Date` (ej. date pickers).
   */
  fromDate(date: Date): string;
}
