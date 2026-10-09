# Better Auth: `authClient` vs `auth.api`

Qué opción conviene en cada caso, según las características de cada uno.

Basado en `better-auth@1.7.7` y en la documentación oficial (`concepts/api`, `concepts/client`, `concepts/rate-limit`).

**Leyenda:** ✅ adecuado · ⚠️ funciona, pero con desventajas · ❌ no funciona o no se debe usar

## Autenticación (acciones del usuario)

| Caso de uso                             | `authClient` | `auth.api` | Recomendado | Motivo                                                                                           |
| --------------------------------------- | ------------ | ---------- | ----------- | ------------------------------------------------------------------------------------------------ |
| Iniciar sesión con email y contraseña   | ✅           | ⚠️         | **Cliente** | Con el cliente tienes rate limiting (3 intentos cada 10 s); con `auth.api` no hay límite         |
| Iniciar sesión con OAuth (Google, etc.) | ✅           | ⚠️         | **Cliente** | El cliente hace la redirección; en el servidor tendrías que redirigir tú con la URL que devuelve |
| Cerrar sesión                           | ✅           | ✅         | **Cliente** | Limpia también el estado de `useSession`                                                         |
| Solicitar reset de contraseña           | ✅           | ⚠️         | **Cliente** | Sin rate limiting, alguien podría usarlo para enviar correos sin parar                           |
| Restablecer la contraseña con el token  | ✅           | ⚠️         | **Cliente** | Es un endpoint sensible y le conviene el rate limiting                                           |
| Cambiar contraseña o email              | ✅           | ⚠️         | **Cliente** | Son endpoints sensibles con límite de 3 cada 10 s                                                |
| Revocar sesiones propias                | ✅           | ✅         | **Cliente** | Es una acción directa del usuario y actualiza su sesión                                          |

## Lectura de sesión

| Caso de uso                                         | `authClient` | `auth.api` | Recomendado  | Motivo                                                                                   |
| --------------------------------------------------- | ------------ | ---------- | ------------ | ---------------------------------------------------------------------------------------- |
| Sesión en un Server Component o `layout.tsx`        | ❌           | ✅         | **Servidor** | `authClient.getSession` no puede leer las cookies en el servidor                         |
| Proteger rutas en `proxy.ts`                        | ❌           | ✅         | **Servidor** | Se ejecuta antes de renderizar la página y hay que pasarle los `headers`                 |
| Sesión en una Server Action o Route Handler         | ❌           | ✅         | **Servidor** | Pasa `headers: await headers()`                                                          |
| Mostrar datos del usuario en la UI (nombre, avatar) | ⚠️           | ✅         | **Servidor** | Léela en el RSC y pásala por props; la documentación desaconseja `useSession` en layouts |
| UI que cambia con la sesión sin recargar            | ✅           | ❌         | **Cliente**  | `useSession()` vuelve a renderizar cuando cambia la sesión                               |

## Autorización y administración

| Caso de uso                                                  | `authClient` | `auth.api` | Recomendado    | Motivo                                                                                   |
| ------------------------------------------------------------ | ------------ | ---------- | -------------- | ---------------------------------------------------------------------------------------- |
| Comprobar permisos antes de devolver o modificar datos       | ❌           | ✅         | **Servidor**   | Una comprobación en el cliente se puede saltar                                           |
| Mostrar u ocultar botones según el rol                       | ✅           | ✅         | **Cualquiera** | Es solo visual: la protección real va en el servidor                                     |
| Crear usuarios por invitación (la app tiene `disableSignUp`) | ⚠️           | ✅         | **Servidor**   | Suele ir junto con otras escrituras en la base de datos dentro de la misma Server Action |
| Cambiar la organización activa                               | ✅           | ✅         | **Cliente**    | Actualiza la sesión reactiva al momento                                                  |
| Gestionar miembros o roles desde un panel                    | ✅           | ✅         | **Cualquiera** | El plugin `organization` comprueba los permisos en el servidor en ambos casos            |
| Scripts, seeds o cron (sin usuario)                          | ❌           | ✅         | **Servidor**   | No hay navegador ni sesión                                                               |

## Regla general

- **Si la acción la inicia el usuario y cambia su sesión o sus credenciales** → `authClient`. Así tienes rate limiting, protección CSRF y `useSession` actualizado.
- **Si hay que leer la sesión o decidir permisos en el servidor** → `auth.api`. El cliente no puede hacerlo o no es fiable para eso.
