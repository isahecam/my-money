# Esquemas de validación

## Objetivo

Definir qué esquema de Valibot se escribe a mano y cuál se deriva de la tabla de Drizzle, dónde vive cada uno y en qué capa se usa.

El criterio es qué describe el esquema:

1. **Lo que el usuario escribe** pertenece a la interfaz: se escribe a mano.
2. **Lo que referencia una fila existente** (un `id`) pertenece a la base de datos: se deriva de la tabla.

## Librerías utilizadas

- `valibot`: todos los esquemas.
- `drizzle-valibot`: genera esquemas a partir de las tablas de Drizzle (`createSelectSchema`, `createInsertSchema`, `createUpdateSchema`).
- `@formisch/react`: formularios, con el esquema escrito a mano.
- `next-safe-action`: valida la entrada de las Server Actions (`inputSchema`, `bindArgsSchemas`).

## Estructura

```text
features/<domain>/
├── schemas/
│   ├── <domain>-schema.ts        # Formulario: a mano, cliente y servidor
│   ├── <domain>-schema.test.ts
│   ├── <domain>-db-schema.ts     # Derivado de la tabla: solo servidor
│   └── <domain>-db-schema.test.ts
└── types.ts                      # Tipos inferidos de la tabla (DTO, inserción)
```

| Necesidad                              | Herramienta                  | Archivo                         | Dónde corre                                   |
| -------------------------------------- | ---------------------------- | ------------------------------- | --------------------------------------------- |
| Datos de un formulario (crear, editar) | Valibot a mano               | `schemas/<domain>-schema.ts`    | Cliente y servidor (Formisch + `inputSchema`) |
| Id de una fila existente               | `drizzle-valibot` + `v.pick` | `schemas/<domain>-db-schema.ts` | Solo servidor (la action)                     |
| Tipo de lectura (DTO)                  | `$inferSelect` + `Omit`      | `types.ts`                      | Solo en compilación                           |
| Tipo de inserción                      | `$inferInsert`               | `types.ts`                      | Solo en compilación                           |

## Esquemas de formulario (`<domain>-schema.ts`)

Se escriben a mano porque describen la interfaz, no la tabla. En `transactions` difieren en casi todos los campos:

| Campo             | En la tabla                                | En el formulario                                        |
| ----------------- | ------------------------------------------ | ------------------------------------------------------- |
| `amount`          | `amountCents`, `bigint` en centavos        | String en pesos; el servicio lo convierte con `toCents` |
| `transactionDate` | `date` con `mode: "string"` → `v.string()` | `v.isoDate`                                             |
| `expenseType`     | Nullable para cualquier tipo               | Obligatorio si `type === "expense"` (`v.variant`)       |
| `concept`         | `text` → `v.string()`                      | `trim`, no vacío, máximo 100 caracteres                 |
| Mensajes          | Los genéricos de Valibot, en inglés        | En español, uno por campo                               |

Reglas:

- Lo importan Client Components (Formisch), así que no debe importar `@/db/schema` ni nada del servidor.
- Los valores de los enums vienen de `features/<domain>/constants.ts`, igual que en la tabla.
- La misma action lo vuelve a validar con `inputSchema`; por eso no lleva `transform`.

## Esquemas derivados de la tabla (`<domain>-db-schema.ts`)

Validan identificadores de filas existentes. Cada campo se valida según el tipo de su columna, así que si la columna cambia (por ejemplo `uuid` → `text`), la validación cambia con ella sin tocar el esquema.

```ts
// Server only: it imports the Drizzle table, so a Client Component must never import it.
import { createSelectSchema } from "drizzle-valibot";
import * as v from "valibot";

import { transactions } from "@/db/schema";

const transactionRow = createSelectSchema(transactions, {
  // Refinement: keeps the generated validation and only replaces its message.
  id: (schema) => v.message(schema, "Movimiento inválido."),
});

export const DeleteTransactionSchema = v.pick(transactionRow, ["id"]);
```

Reglas:

- Solo los importa el servidor (actions). Importan la tabla de Drizzle, que no debe llegar al bundle del cliente.
- Para los ids se usa `createSelectSchema`: el id ya existe, no se inserta.
- Para cambiar el mensaje se usa un refinamiento (`(schema) => v.message(schema, "...")`), no un reemplazo: reemplazar el campo con otro esquema vuelve a fijar su tipo a mano.
- Se exporta solo lo que usa alguna action, recortado con `v.pick`.

Mapeo de columnas que aplica `drizzle-valibot` (versión 0.4.2):

| Columna                  | Esquema generado                                  |
| ------------------------ | ------------------------------------------------- |
| `uuid()`                 | `v.pipe(v.string(), v.uuid())`                    |
| `text()`                 | `v.string()`                                      |
| `varchar({ length: n })` | `v.pipe(v.string(), v.maxLength(n))`              |
| `integer()` / `serial()` | `v.pipe(v.number(), …)` con `v.integer()` y rango |
| `pgEnum`                 | `v.enum(...)` con los valores del enum            |
| Columna nullable         | Envuelta en `v.nullable(...)`                     |

### Uso en las actions

Una action que solo recibe el id lo valida como entrada:

```ts
export const deleteTransaction = authActionClient
  .inputSchema(DeleteTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    /* ... */
  });
```

Una action que recibe un formulario y además un id (editar) separa los dos con argumentos ligados (`bindArgsSchemas`), según la guía de next-safe-action (`.agents/skills/safe-action-advanced/bind-arguments.md`). Así el formulario reutiliza el mismo esquema que el de crear, sin agregarle un campo `id`:

```ts
export const updateTransaction = authActionClient
  .bindArgsSchemas([TransactionIdSchema]) // derivado de la tabla
  .inputSchema(TransactionSchema) // el mismo esquema del formulario
  .action(async ({ parsedInput, bindArgsParsedInputs: [id], ctx }) => {
    /* ... */
  });

// Cliente: el id viaja ligado, el formulario solo envía sus campos.
const { execute } = useAction(updateTransaction.bind(null, transaction.id), {/* ... */});
```

Si un argumento ligado no pasa la validación, next-safe-action lo envía a `handleServerError` y la action responde con el error genérico (`UNEXPECTED`). Es aceptable: un id inválido solo llega si se manipula la petición.

## Tipos (`types.ts`)

Los DTO siguen siendo tipos inferidos de la tabla (`$inferSelect` / `$inferInsert`), no esquemas:

- Un tipo existe solo en compilación; un esquema valida en tiempo de ejecución.
- Ambos se derivan de la misma tabla, así que se mantienen sincronizados sin más trabajo.
- No se valida con `createSelectSchema` lo que se lee de la propia base de datos: Drizzle ya lo tipa, y la documentación lo plantea para validar respuestas de APIs externas.

## Lo que no se hace

- Generar el esquema del formulario con `createInsertSchema`: habría que reemplazar casi todos los campos y la tabla llegaría al cliente.
- Escribir a mano el formato de un id (`v.uuid()`) en una action: se deriva de la columna.
- Volver a validar en tiempo de ejecución los datos que devuelve el repository.
- Delegar la seguridad a la validación del id: el acceso lo restringe el repository filtrando por `userId`.

## Migración a Drizzle v1

Desde `drizzle-orm@1.0.0-beta.15`, `drizzle-valibot` está obsoleto y su funcionalidad vive en `drizzle-orm/valibot`, con la misma API. Al actualizar Drizzle:

1. Cambiar `from "drizzle-valibot"` por `from "drizzle-orm/valibot"` en los archivos `*-db-schema.ts`.
2. Quitar la dependencia `drizzle-valibot`.
3. Ejecutar los tests `*-db-schema.test.ts`.

## Referencias

- Drizzle + Valibot: https://orm.drizzle.team/docs/valibot (y `node_modules/drizzle-valibot/README.md` para la versión instalada).
- Valibot `message`: https://valibot.dev/api/message/
- Valibot `pick`: https://valibot.dev/api/pick/
- next-safe-action, argumentos ligados: `.agents/skills/safe-action-advanced/bind-arguments.md`
