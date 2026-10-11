# Formularios

## Objetivo

Definir cómo se inicializa y se actualiza el estado de los formularios de Formisch (`@formisch/react`), en especial los de edición, que se precargan con datos del servidor.

Los esquemas de validación están en `docs/VALIDATION_SCHEMAS.md`.

## Estructura por feature

```text
features/<domain>/
├── components/
│   ├── <domain>-form.tsx                        # Campos, compartidos por crear y editar
│   ├── create-<domain>-drawer-dialog.tsx        # Trigger + Dialog/Drawer de crear
│   └── edit-<domain>-drawer-dialog.tsx          # Trigger + Dialog/Drawer de editar
└── hooks/
    ├── use-create-<domain>.ts                   # useForm + useAction de crear
    └── use-update-<domain>.ts                   # useForm + useAction de editar
```

- Los campos viven en un solo componente (`<domain>-form.tsx`) que recibe el store con la prop `of`. Crear y editar lo reutilizan.
- Cada diálogo contiene su propio trigger y se usa directamente donde hace falta (por ejemplo, en la columna de acciones de una tabla).

## `initialInput` se lee una sola vez

`useForm` crea el store al montar y no vuelve a leer `initialInput`. En `@formisch/react@1.1.0`:

```js
const internalFormStore = useMemo(() => createFormStore(config, ...), []);
```

Formisch no tiene un equivalente a la opción `values` de React Hook Form, que se actualiza sola cuando cambian los datos externos. `initialInput` funciona como `defaultValues`.

## Actualizar el formulario con datos nuevos: `reset` con `initialInput`

La documentación de Formisch indica usar `reset` con un nuevo `initialInput` cuando cambian los datos del servidor:

> If you need to update the form because the initial data has changed (e.g., remote data was refreshed), use `reset` with a new `initialInput` instead of `setInput`. The `reset` method properly reinitializes the form state, while `setInput` only changes the current input values without updating the initial state.

`reset` también actualiza la base con la que se calcula `isDirty`. Solo se refleja en campos controlados (`value={field.input}`), que es como están todos los campos del proyecto.

### En los formularios de edición

El `reset` va en el evento de apertura del diálogo, no en un `useEffect`:

```ts
export function useUpdateTransaction(transaction: TransactionDto) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    schema: TransactionSchema,
    initialInput: {
      type: transaction.type,
      expenseType: transaction.expenseType ?? undefined,
      concept: transaction.concept,
      amount: fromCents(transaction.amountCents),
      paymentMethod: transaction.paymentMethod,
      transactionDate: transaction.transactionDate,
      notes: transaction.notes ?? undefined,
    },
  });

  // ...useAction: on success, toast + setOpen(false), without reset.

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen)
      reset(form, {
        initialInput: {
          type: transaction.type,
          expenseType: transaction.expenseType ?? undefined,
          concept: transaction.concept,
          amount: fromCents(transaction.amountCents),
          paymentMethod: transaction.paymentMethod,
          transactionDate: transaction.transactionDate,
          notes: transaction.notes ?? undefined,
        },
      });
    setOpen(nextOpen);
  }

  return { form, open, handleOpenChange, handleSubmit, isPending };
}
```

```tsx
<Dialog open={open} onOpenChange={handleOpenChange}>
```

Al abrir:

- Carga los últimos valores guardados. Tras guardar, `refresh()` en la action vuelve a renderizar la página y la fila recibe el registro actualizado.
- Descarta los cambios de un intento cancelado.
- Limpia los errores del intento anterior.

### En los formularios de creación

Se llama a `reset(form)` en `onSuccess`, para que el siguiente registro empiece con los valores iniciales.

## Del registro guardado al input del formulario

El DTO tiene la forma de la tabla y el formulario la de la interfaz (ver la tabla de diferencias en `docs/VALIDATION_SCHEMAS.md`).

- El contrato del input es el esquema, no el DTO: `useForm` y `reset` tipan `initialInput` a partir de `TransactionSchema`, sin anotaciones propias.
- El objeto se escribe en línea dentro de `initialInput` (en `useForm` y en `reset`), sin una función de conversión aparte.
- Montos: `fromCents` (`utils/money.ts`), el inverso de `toCents`.
- `null` de la base → `undefined` (campo vacío).
- Solo los campos del formulario: nada de `id`, `userId` ni timestamps.

## Enviar el id de la fila

El formulario de edición usa el mismo esquema que el de creación. El id no es un campo: viaja como argumento ligado a la action (`bindArgsSchemas`), según `docs/VALIDATION_SCHEMAS.md`:

```ts
const { execute, isPending } = useAction(updateTransaction.bind(null, transaction.id), {/* ... */});
```

## Lo que no se hace

- Pasar datos nuevos a `initialInput` esperando que el formulario se actualice: solo se lee al montar.
- Sincronizar el formulario con un `useEffect` que observe el registro: la apertura del diálogo ya es el evento.
- Usar `setInput` para cargar datos del servidor: cambia el valor actual, pero no la base de `isDirty`.
- Extraer la conversión del registro a una función (`toFormInput`) ni tiparla con el DTO: el objeto va en línea y lo tipa el esquema.
- Usar `executeAsync` en el submit: lanza en la redirección a `/sign-in` y Formisch lo mostraría como error del formulario.

## Referencias

- Formisch, "Form methods" (setting values): `website/src/routes/(docs)/react/guides/(main-concepts)/form-methods/index.mdx` en `open-circle/formisch`.
- Formisch, "Migrate from React Hook Form" (reset): `website/src/routes/(docs)/react/guides/(migration-guides)/migrate-from-react-hook-form/index.mdx` en `open-circle/formisch`.
- React Hook Form, `useForm` → `values` y `resetOptions`: `src/content/docs/useform.mdx` en `react-hook-form/documentation`.
- Implementación de referencia: `features/transactions/hooks/use-update-transaction.ts`.
