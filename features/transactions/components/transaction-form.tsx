"use client";

import { Field as FormischField, useField } from "@formisch/react";
import type { FormStore } from "@formisch/react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";
import { es } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  EXPENSE_TYPE_DESCRIPTIONS,
  EXPENSE_TYPE_LABELS,
  EXPENSE_TYPES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPES,
} from "@/features/transactions/constants";
import { TransactionSchema } from "@/features/transactions/schemas/transaction-schema";

const longDate = new Intl.DateTimeFormat("es-MX", { dateStyle: "long" });

export function TransactionForm({ of }: Readonly<{ of: FormStore<typeof TransactionSchema> }>) {
  const baseId = useId();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const transactionTypeField = useField(of, { path: ["type"] });

  return (
    <FieldGroup>
      <FormischField of={of} path={["type"]}>
        {(field) => (
          <FieldSet data-invalid={field.errors !== null}>
            <FieldLegend id={`${baseId}-type-label`} variant="label">
              Tipo
            </FieldLegend>
            <RadioGroup
              aria-labelledby={`${baseId}-type-label`}
              aria-invalid={field.errors !== null}
              aria-errormessage={field.errors ? `${baseId}-type-error` : undefined}
              name={field.props.name}
              inputRef={field.props.ref}
              value={field.input}
              // Moving between radios is not leaving the field.
              onFocus={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) field.props.onFocus();
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) field.props.onBlur();
              }}
              onValueChange={field.onChange}
              className="grid-cols-2">
              {TRANSACTION_TYPES.map((value) => (
                <Field key={value} orientation="horizontal" data-invalid={field.errors !== null}>
                  <RadioGroupItem
                    value={value}
                    id={`${baseId}-type-${value}`}
                    aria-invalid={field.errors !== null}
                  />
                  <FieldLabel htmlFor={`${baseId}-type-${value}`}>
                    {TRANSACTION_TYPE_LABELS[value]}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
            {field.errors && (
              <FieldError
                id={`${baseId}-type-error`}
                errors={field.errors.map((message) => ({ message }))}
              />
            )}
          </FieldSet>
        )}
      </FormischField>

      {transactionTypeField.input === "expense" && (
        <FormischField of={of} path={["expenseType"]}>
          {(field) => (
            <FieldSet data-invalid={field.errors !== null}>
              <FieldLegend id={`${baseId}-expenseType-label`} variant="label">
                Tipo de gasto
              </FieldLegend>
              <RadioGroup
                aria-labelledby={`${baseId}-expenseType-label`}
                aria-invalid={field.errors !== null}
                aria-errormessage={field.errors ? `${baseId}-expenseType-error` : undefined}
                name={field.props.name}
                inputRef={field.props.ref}
                value={field.input ?? null}
                onFocus={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) field.props.onFocus();
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) field.props.onBlur();
                }}
                onValueChange={field.onChange}>
                {EXPENSE_TYPES.map((value) => (
                  <FieldLabel key={value} htmlFor={`${baseId}-expenseType-${value}`}>
                    <Field orientation="horizontal" data-invalid={field.errors !== null}>
                      <FieldContent>
                        <FieldTitle>{EXPENSE_TYPE_LABELS[value]}</FieldTitle>
                        <FieldDescription>{EXPENSE_TYPE_DESCRIPTIONS[value]}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={value}
                        id={`${baseId}-expenseType-${value}`}
                        aria-invalid={field.errors !== null}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {field.errors && (
                <FieldError
                  id={`${baseId}-expenseType-error`}
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </FieldSet>
          )}
        </FormischField>
      )}

      <FormischField of={of} path={["concept"]}>
        {(field) => (
          <Field data-invalid={field.errors !== null}>
            <FieldLabel htmlFor={`${baseId}-concept`}>Concepto</FieldLabel>
            <Input
              {...field.props}
              id={`${baseId}-concept`}
              value={field.input ?? ""}
              aria-invalid={field.errors !== null}
              aria-errormessage={field.errors ? `${baseId}-concept-error` : undefined}
              autoComplete="off"
              placeholder="Supermercado"
            />
            {field.errors && (
              <FieldError
                id={`${baseId}-concept-error`}
                errors={field.errors.map((message) => ({ message }))}
              />
            )}
          </Field>
        )}
      </FormischField>

      <FormischField of={of} path={["amount"]}>
        {(field) => (
          <Field data-invalid={field.errors !== null}>
            <FieldLabel htmlFor={`${baseId}-amount`}>Monto</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...field.props}
                id={`${baseId}-amount`}
                value={field.input ?? ""}
                aria-invalid={field.errors !== null}
                aria-errormessage={field.errors ? `${baseId}-amount-error` : undefined}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
              />
            </InputGroup>
            {field.errors && (
              <FieldError
                id={`${baseId}-amount-error`}
                errors={field.errors.map((message) => ({ message }))}
              />
            )}
          </Field>
        )}
      </FormischField>

      <FormischField of={of} path={["paymentMethod"]}>
        {(field) => (
          <Field data-invalid={field.errors !== null}>
            <FieldLabel htmlFor={`${baseId}-paymentMethod`}>Método de pago</FieldLabel>
            <Select
              name={field.props.name}
              inputRef={field.props.ref}
              items={PAYMENT_METHOD_LABELS}
              value={field.input ?? null}
              onValueChange={(value) => field.onChange(value ?? undefined)}>
              <SelectTrigger
                id={`${baseId}-paymentMethod`}
                onFocus={field.props.onFocus}
                onBlur={field.props.onBlur}
                aria-invalid={field.errors !== null}
                aria-errormessage={field.errors ? `${baseId}-paymentMethod-error` : undefined}
                className="w-full">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PAYMENT_METHODS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {PAYMENT_METHOD_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {field.errors && (
              <FieldError
                id={`${baseId}-paymentMethod-error`}
                errors={field.errors.map((message) => ({ message }))}
              />
            )}
          </Field>
        )}
      </FormischField>

      <FormischField of={of} path={["transactionDate"]}>
        {(field) => {
          // parseISO reads "YYYY-MM-DD" as local midnight, so the day doesn't shift.
          const date = field.input ? parseISO(field.input) : undefined;
          return (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor={`${baseId}-transactionDate`}>Fecha</FieldLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      id={`${baseId}-transactionDate`}
                      variant="outline"
                      aria-invalid={field.errors !== null}
                      className="justify-start"
                    />
                  }>
                  <CalendarIcon />
                  {date ? (
                    longDate.format(date)
                  ) : (
                    <span className="text-muted-foreground">Selecciona una fecha</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <Calendar
                    mode="single"
                    locale={es}
                    selected={date}
                    defaultMonth={date}
                    onSelect={(day) => {
                      field.onChange(day ? format(day, "yyyy-MM-dd") : undefined);
                      setIsCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
            </Field>
          );
        }}
      </FormischField>

      <FormischField of={of} path={["notes"]}>
        {(field) => (
          <Field data-invalid={field.errors !== null}>
            <FieldLabel htmlFor={`${baseId}-notes`}>Notas</FieldLabel>
            <Textarea
              {...field.props}
              id={`${baseId}-notes`}
              value={field.input ?? ""}
              aria-invalid={field.errors !== null}
              aria-errormessage={field.errors ? `${baseId}-notes-error` : undefined}
              rows={3}
            />
            <FieldDescription>Opcional.</FieldDescription>
            {field.errors && (
              <FieldError
                id={`${baseId}-notes-error`}
                errors={field.errors.map((message) => ({ message }))}
              />
            )}
          </Field>
        )}
      </FormischField>
    </FieldGroup>
  );
}
