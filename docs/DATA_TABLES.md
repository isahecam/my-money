# Composición de las tablas de datos

## Objetivo

Las tablas deben separar claramente:

1. La obtención y preparación de datos.
2. La definición de columnas.
3. La representación visual.
4. Los filtros y la paginación.
5. Las acciones disponibles para cada registro.

La tabla no debe contener reglas de negocio ni consultas directas a la base de datos.

## Librerías utilizadas

- `@tanstack/react-table`: columnas, filas, celdas, estado y paginación.
- `shadcn/ui`: componentes visuales como `Table`, `Button`, `Badge` y sus subcomponentes.
- `nuqs`: sincronización de filtros y paginación con los parámetros de la URL.
- `lucide-react`: iconos para acciones y controles.
- `Tailwind CSS`: layout, espaciado, truncamiento y estados visuales.

## Estructura recomendada

Cada tabla debe organizarse dentro de su feature:

```text
feature/
├── components/
│   ├── feature-filters.tsx
│   └── feature-table/
│       ├── columns.tsx
│       └── data-table.tsx
├── hooks/
│   └── use-feature-filters.ts
├── lib/
│   └── search-params.ts
├── queries/
│   └── get-feature.ts
├── services/
│   └── feature-service.ts
└── repositories/
    └── feature-repository.ts
```

## Responsabilidad de cada capa

### Página

La página debe:

- Ejecutar el guard correspondiente.
- Leer los parámetros de búsqueda.
- Consultar los datos mediante una query.
- Mostrar el estado vacío cuando no existen registros.
- Renderizar la tabla cuando existen datos.

No debe construir columnas ni contener lógica de paginación.

### Query

La query debe validar el acceso a la organización o sucursal y delegar la consulta al servicio.

### Servicio

El servicio debe:

- Normalizar los filtros.
- Aplicar límites mínimos y máximos al tamaño de página.
- Coordinar la consulta de registros y el conteo total.
- Mantener las reglas de negocio relacionadas con la consulta.

### Repository

El repository debe:

- Consultar la base de datos.
- Aplicar filtros, ordenamiento, límite y offset.
- Restringir siempre los datos por `organizationId`.
- Aplicar también `teamId` cuando la información sea específica de una sucursal.
- Retornar datos crudos, sin componentes visuales ni transformaciones de interfaz.

## Definición de columnas

`columns.tsx` debe usar `createColumnHelper` y definir:

- Columnas de datos mediante `accessor`.
- Columnas de acciones mediante `display`.
- Formateo de fechas y monedas en la celda.
- Estados mediante `Badge`.
- Fallbacks como `—` para valores opcionales.
- Truncamiento para textos largos.

```tsx
const columnHelper = createColumnHelper<DataTableFeatures, Entity>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Nombre",
  }),

  columnHelper.accessor("isActive", {
    header: "Estado",
    cell: (info) => (
      <Badge variant={info.getValue() ? "default" : "secondary"}>
        {info.getValue() ? "Activo" : "Inactivo"}
      </Badge>
    ),
  }),

  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <div className="flex items-center gap-2">{/* Acciones de la fila */}</div>,
  }),
]);
```

Las columnas no deben contener consultas ni reglas de negocio.

## Componente `DataTable`

El componente debe ser genérico y recibir los datos, las columnas y el total:

```tsx
interface DataTableProps<TData extends RowData & { id: string }> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  total: number;
}
```

Cada entidad debe contar con un `id` estable para identificar correctamente sus filas.

La configuración debe:

- Usar `useTable` de `@tanstack/react-table`.
- Recibir `features` desde el helper común.
- Definir `getRowId`.
- Usar `manualPagination: true` cuando los datos llegan paginados desde el servidor.
- Recibir el total mediante `rowCount`.
- Leer página y tamaño desde los filtros de URL.
- Actualizar la URL al cambiar de página.

```tsx
const table = useTable({
  features,
  data,
  columns,
  manualPagination: true,
  rowCount: total,
  getRowId: (row) => row.id,
  state: {
    pagination: {
      pageIndex: filters.page - 1,
      pageSize: filters.pageSize,
    },
  },
  onPaginationChange: (updater) => {
    const current = {
      pageIndex: filters.page - 1,
      pageSize: filters.pageSize,
    };

    const next = typeof updater === "function" ? updater(current) : updater;

    setFilters({
      page: next.pageIndex + 1,
      pageSize: next.pageSize,
    });
  },
});
```

## Renderizado visual

Usar los componentes de `shadcn/ui`:

```tsx
<div className="overflow-hidden rounded-md border">
  <Table>
    <TableHeader className="sticky top-0 z-10 bg-muted">{/* Encabezados */}</TableHeader>
    <TableBody>{/* Filas y celdas */}</TableBody>
  </Table>
</div>
```

Para los encabezados:

- Usar `table.getHeaderGroups()`.
- Usar `table.FlexRender` para renderizar el contenido.

Para las filas:

- Usar `table.getRowModel().rows`.
- Usar `row.id` y `cell.id` como `key`.
- Usar `row.getVisibleCells()`.
- Renderizar cada celda con `table.FlexRender`.

Cuando no haya resultados:

```tsx
<TableRow>
  <TableCell colSpan={columns.length} className="h-24 text-center">
    No se encontraron resultados.
  </TableCell>
</TableRow>
```

El estado vacío general debe distinguir entre:

- No existen registros y no hay filtros.
- No existen resultados para los filtros aplicados.

## Filtros

Los filtros deben:

- Vivir en un componente separado.
- Sincronizarse con la URL mediante `nuqs`.
- Reiniciar la página a `1` cuando cambie la búsqueda.
- Aplicar debounce a los campos de búsqueda.
- Mostrar el conteo total cuando corresponda.
- Permitir limpiar los filtros.
- Reutilizar componentes como `SearchInput` y `Button`.

```tsx
setSearchParams({
  search: value,
  page: 1,
});
```

Los filtros visibles deben coincidir con los aceptados por la query, el servicio y el repository.

## Paginación

La paginación debe ejecutarse en el servidor:

1. El usuario cambia de página.
2. Se actualizan los parámetros de la URL.
3. Se vuelve a ejecutar la página.
4. La query recibe los nuevos filtros.
5. El servicio normaliza los valores.
6. El repository consulta únicamente la página solicitada.
7. La tabla recibe los nuevos datos y el total.

Consideraciones:

- `page` inicia en `1`.
- `pageIndex` inicia en `0`; por eso se usa `page - 1`.
- `pageSize` debe tener un valor predeterminado.
- El servicio debe limitar el tamaño máximo de página.
- Los botones deben usar `getCanPreviousPage()` y `getCanNextPage()`.
- No se deben cargar todos los registros en el navegador para paginarlos localmente.

## Formateo de datos

El formateo debe realizarse en la capa de presentación:

- Fechas mediante el adaptador de fechas del proyecto.
- Monedas mediante el adaptador de dinero.
- Estados mediante `Badge`.
- Valores opcionales mediante `—`.
- Textos largos mediante `truncate` y `title`.

No se deben realizar cálculos de negocio directamente dentro de una celda.

## Acciones por fila

Las acciones deben:

- Estar en una columna `display`.
- Recibir el registro completo desde `row.original`.
- Delegar la operación a un diálogo o componente de acción.
- Respetar los permisos y guards de la feature.
- Mostrar estados claros para activar, desactivar, editar o eliminar.
- No ejecutar mutaciones directamente desde la tabla.

## Features compartidas

La configuración común de React Table debe mantenerse en un único helper. Actualmente contempla:

- Filtrado por columnas.
- Visibilidad de columnas.
- Paginación.
- Selección de filas.
- Ordenamiento.
- Modelos de filas filtradas y ordenadas.
- Funciones de filtrado y ordenamiento.

Si una tabla necesita una capacidad nueva:

1. Verificar si ya existe en el helper común.
2. Agregarla al helper compartido si aplica a varias tablas.
3. Evitar registrar features innecesarias en tablas simples.
4. Actualizar los tipos asociados para conservar el tipado.

## Reglas de consistencia

- Los identificadores y nombres de variables permanecen en inglés.
- Los textos visibles para el usuario están en español.
- Todas las tablas tienen un `id` estable por fila.
- Las columnas están tipadas con la entidad correspondiente.
- Las consultas respetan la organización y la sucursal activa.
- La paginación permanece sincronizada con la URL.
- Las acciones reutilizan componentes existentes.
- No se duplica lógica de filtros, fechas, monedas o permisos.
- No se agregan colores arbitrarios; se usan tokens semánticos.
- No se agrega lógica de negocio al componente visual de la tabla.
