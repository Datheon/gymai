# CLAUDE.md — GymAI Frontend Conventions

> Este archivo es la fuente de verdad para cualquier agente IA (Cline, Claude Code, Copilot) que trabaje en este proyecto.
> Léelo completo antes de escribir una sola línea de código.

---

## 1. Visión del Proyecto

**GymAI** es un SaaS de gestión para gimnasios. Este repositorio contiene el **frontend** como monorepo.

**Metodología:** Scrumban (Sprints + flujo visual diario)
**Gestión:** Taiga (épicas, user stories, tasks)
**Slug Taiga:** `datheon-gymai`

---

## 2. Stack Tecnológico (2026)

| Capa | Herramienta | Versión mínima |
|---|---|---|
| Runtime | Bun | latest |
| Monorepo | Turborepo + Bun Workspaces | latest |
| Framework | TanStack Start (SSR/CSR) | latest |
| Lenguaje | TypeScript (strict mode) | 5.x |
| Routing | TanStack Router (file-based) | latest |
| Estado servidor | TanStack Query | latest |
| Estado cliente | Zustand | latest |
| Validación | Zod | latest |
| UI Components | shadcn/ui | latest |
| Estilos | Tailwind CSS v4 | latest |
| Auth | Better-Auth | latest |
| Formularios | React Hook Form + Zod resolver | latest |
| Linter/Formatter | Biome | latest |
| Commits | Commitizen + Commitlint + Husky | latest |
| Testing Unit | Vitest | latest |
| Testing E2E | Playwright | latest |
| CI/CD | GitHub Actions | - |

---

## 3. Principios de Ingeniería

### ADN del código

- **SOLID** — Cada módulo, componente y función tiene una sola responsabilidad
- **KISS** — La solución más simple que funcione. Sin sobreingeniería
- **DRY** — No repitas lógica, pero no sobreabstraigas prematuramente
- **YAGNI** — No construyas lo que no se necesita hoy
- **Mínima Sorpresa** — Si parece un botón, actúa como botón
- **Composición sobre herencia** — Piezas pequeñas que se ensamblan

### Reglas de calidad

- Naming claro y consistente (inglés para código, español para docs de negocio)
- Refactor continuo, deuda técnica visible y priorizada
- Code review obligatorio en cada PR
- Documentación mínima útil — ni nula, ni excesiva
- Ownership claro por área de código (ver CODEOWNERS)

---

## 4. Arquitectura: Feature-Sliced Design (FSD)

```
apps/fitos-app/src/
├── app/            # Providers, router, global styles, entry point
├── pages/          # Composición de widgets por ruta
├── widgets/        # Secciones autónomas de UI (sidebar, header, layout)
├── features/       # Funcionalidad con interacción del usuario
├── entities/       # Objetos de negocio (client, membership, class, payment)
└── shared/         # Ladrillos base (ui, api, config, lib, types)
```

### Reglas FSD

- Las capas superiores importan de inferiores, **nunca al revés**
- `shared/` no importa de ninguna otra capa
- `features/` no importa de `widgets/` ni de `pages/`
- Cada slice tiene su estructura interna: `api/`, `model/`, `ui/`
- Los contratos entre capas se definen con tipos TypeScript y schemas Zod

### Estructura interna de un slice

```
features/auth/login/
├── api/          # Llamadas al backend, queries TanStack Query
├── model/        # Tipos, schemas Zod, stores Zustand si aplica
└── ui/           # Componentes React del feature
    ├── LoginForm.tsx
    └── index.ts  # Re-export público
```

---

## 5. Jerarquía de Componentes

```
shared/ui (átomos)     → Button, Input, Badge, Card
entities (moléculas)   → ClientCard, MembershipBadge
features (organismos)  → LoginForm, ClientCreateForm
widgets (secciones)    → Sidebar, DashboardStats
pages (composición)    → DashboardPage, ClientsPage
```

### Reglas de componentes

- Componentes pequeños y de responsabilidad única
- Props tipadas con TypeScript, validadas con Zod donde entre data externa
- Separar lógica (hooks) de presentación (componentes)
- Loading states, error states y empty states siempre definidos
- Accesibilidad real: contraste, foco, ARIA labels

---

## 6. Patrones de Diseño

### Patrones principales

| Patrón | Dónde se aplica | Ejemplo |
|---|---|---|
| **Repository** | `entities/*/api/` | `clientRepository.getAll()`, `clientRepository.create(data)` — abstrae fetch detrás de una interfaz tipada |
| **Adapter** | `shared/lib/adapters/` | `authAdapter.ts` envuelve Better-Auth, `paymentAdapter.ts` envuelve la pasarela de pago |
| **Factory** | `entities/*/model/` | `createClient(raw)` valida con Zod y retorna un `Client` tipado o lanza error |
| **Facade** | `features/*/index.ts` | Cada feature exporta solo lo público: componentes, hooks, tipos. La complejidad interna queda oculta |
| **Observer** | `entities/*/model/` | Zustand stores + TanStack Query — los componentes se suscriben y reaccionan sin acoplarse |

### Cómo se conectan con FSD

```
shared/lib/
├── adapters/
│   ├── authAdapter.ts        # Adapter → envuelve Better-Auth
│   ├── httpAdapter.ts        # Adapter → envuelve fetch/axios
│   └── paymentAdapter.ts     # Adapter → envuelve pasarela de pago

entities/client/
├── api/
│   └── clientRepository.ts   # Repository → usa httpAdapter internamente
├── model/
│   ├── client.schema.ts      # Zod schema
│   ├── client.types.ts       # TypeScript types (inferidos de Zod)
│   └── clientFactory.ts      # Factory → valida y construye Client
└── ui/
    └── ClientCard.tsx

features/crm/clients/
├── api/
│   └── useClients.ts         # TanStack Query hook → usa clientRepository
├── model/
│   └── clientsStore.ts       # Zustand → estado de UI (filtros, selección)
├── ui/
│   ├── ClientList.tsx
│   └── ClientCreateForm.tsx
└── index.ts                  # Facade → export { ClientList, ClientCreateForm, useClients }
```

### Reglas de patrones

- **Repository** — nunca hacer `fetch()` directo en componentes ni hooks. Siempre pasar por el repository de la entidad
- **Adapter** — toda librería externa se envuelve en un adapter en `shared/lib/adapters/`. Si cambias de librería, solo tocas el adapter
- **Factory** — toda data que entra del servidor pasa por una factory que valida con Zod antes de entrar al estado
- **Facade** — los `index.ts` de cada feature son el contrato público. Nunca importar archivos internos de otro feature directamente
- **Observer** — no pasar callbacks entre componentes para sincronizar estado. Usar Zustand o TanStack Query como canal de comunicación

---

## 7. Sistema de Resiliencia

> Un frontend resiliente no es el que nunca falla, es el que falla con gracia y se recupera solo.

### 7.1 Error Boundaries (Contención de fallos)

Cada capa de FSD tiene su propio Error Boundary para que un fallo en un feature no tumbe toda la app.

```
app/                  → AppErrorBoundary (pantalla de error global, último recurso)
pages/                → PageErrorBoundary (error de página, ofrece recargar)
widgets/              → WidgetErrorBoundary (el widget falla, el resto sigue)
features/             → FeatureErrorBoundary (el feature falla, muestra fallback)
```

**Regla:** Nunca dejar que un error se propague sin atrapar. Cada widget y feature se envuelve en su propio boundary.

### 7.2 Retry y Backoff (Reintentos inteligentes)

Toda llamada a API usa TanStack Query con política de reintentos:

```typescript
// shared/lib/queryConfig.ts
export const defaultQueryOptions = {
  retry: 3,                          // 3 reintentos antes de fallar
  retryDelay: (attempt: number) =>   // Backoff exponencial
    Math.min(1000 * 2 ** attempt, 30000),
  staleTime: 5 * 60 * 1000,         // 5 min antes de refetch
  gcTime: 10 * 60 * 1000,           // 10 min en cache antes de garbage collect
};
```

**Regla:** Nunca hacer un fetch sin retry configurado. TanStack Query lo maneja por defecto.

### 7.3 Optimistic Updates (Actualizaciones optimistas)

Para operaciones de escritura (crear cliente, procesar pago), actualizar la UI antes de la confirmación del servidor:

```typescript
// 1. Actualizar cache inmediatamente (el usuario ve el cambio al instante)
// 2. Enviar la mutación al servidor
// 3. Si falla → rollback automático al estado anterior
// 4. Si éxito → invalidar query para sincronizar con servidor
```

**Regla:** Usar optimistic updates en toda operación CRUD donde el usuario espera feedback inmediato.

### 7.4 Offline Resilience (Tolerancia a desconexión)

```
┌─────────────────────────┬────────────────────────────┐
│  Estado de red          │  Comportamiento            │
├─────────────────────────┼────────────────────────────┤
│  Online                 │  Operación normal           │
│  Offline (lectura)      │  Servir desde cache          │
│  Offline (escritura)    │  Encolar mutación            │
│  Reconexión             │  Ejecutar cola automático    │
│  Conexión lenta         │  Timeout + mensaje al user   │
└─────────────────────────┴────────────────────────────┘
```

**Implementación:**

- TanStack Query `networkMode: 'offlineFirst'` para lecturas desde cache
- `onlineManager` de TanStack Query para detectar estado de red
- Cola de mutaciones pendientes que se ejecutan al reconectar
- Banner visible: "Sin conexión — los cambios se guardarán cuando vuelvas a estar en línea"

### 7.5 Timeout y Circuit Breaker

```typescript
// shared/lib/adapters/httpAdapter.ts
const HTTP_CONFIG = {
  timeout: 10_000,            // 10s timeout por request
  circuitBreaker: {
    failureThreshold: 5,      // Después de 5 fallos consecutivos
    resetTimeout: 30_000,     // Esperar 30s antes de reintentar
  },
};
```

**Circuit Breaker — 3 estados:**

```
CLOSED (normal)  → Las peticiones pasan normalmente
                   Si fallan 5 seguidas → pasa a OPEN

OPEN (cortado)   → Todas las peticiones se rechazan inmediatamente
                   (no saturar servidor caído)
                   Después de 30s → pasa a HALF-OPEN

HALF-OPEN        → Deja pasar 1 petición de prueba
                   Si éxito → vuelve a CLOSED
                   Si falla → vuelve a OPEN
```

**Regla:** El httpAdapter implementa circuit breaker. Si el servidor está caído, no lo bombardeamos con requests.

### 7.6 Graceful Degradation (Degradación elegante)

Cuando un servicio falla, la app sigue funcionando con capacidad reducida:

```
┌──────────────────────────┬────────────────────────────────────┐
│  Servicio caído          │  Degradación                       │
├──────────────────────────┼────────────────────────────────────┤
│  API de pagos            │  Dashboard muestra datos cacheados  │
│                          │  Botón "Procesar pago" deshabilitado│
│                          │  Banner: "Pagos temporalmente no    │
│                          │  disponible"                        │
├──────────────────────────┼────────────────────────────────────┤
│  API de auth             │  Sesión actual sigue activa         │
│                          │  Login/register deshabilitados      │
│                          │  Redirect a página de mantenimiento │
├──────────────────────────┼────────────────────────────────────┤
│  API de clientes         │  Lista muestra último cache         │
│                          │  Crear/editar deshabilitado         │
│                          │  Búsqueda funciona sobre cache      │
└──────────────────────────┴────────────────────────────────────┘
```

**Regla:** Ningún servicio caído debe producir una pantalla blanca. Siempre hay un fallback visible y útil.

### 7.7 Rate Limiting en Cliente

```typescript
// shared/lib/rateLimiter.ts
// Proteger contra clicks repetidos y floods accidentales
const RATE_LIMITS = {
  mutations: { maxRequests: 5, windowMs: 10_000 },   // 5 escrituras por 10s
  searches: { maxRequests: 10, windowMs: 5_000 },    // 10 búsquedas por 5s
  auth: { maxRequests: 3, windowMs: 60_000 },        // 3 intentos login por min
};
```

**Regla:** Todo botón de acción tiene debounce o throttle. Nunca confiar en que el usuario hará un solo click.

### 7.8 Logging y Observabilidad en Cliente

```typescript
// shared/lib/logger.ts
// Niveles: debug | info | warn | error | fatal
const logger = {
  error: (context: string, error: Error, meta?: Record<string, unknown>) => {
    // 1. Log a consola en desarrollo
    // 2. Enviar a servicio de tracking en producción (Sentry, LogRocket)
    // 3. Incluir: userId, ruta actual, timestamp, stack trace
  },
};
```

**Qué loggear:**

- Errores de API (status, endpoint, payload sin datos sensibles)
- Errores de validación Zod (schema que falló, campo inválido)
- Circuit breaker abierto/cerrado
- Mutaciones en cola offline
- Errores de auth (token expirado, sesión inválida)

**Qué NUNCA loggear:**

- Passwords, tokens, datos de tarjeta
- Información personal del cliente (nombre, email, teléfono)

### 7.9 Health Checks

```typescript
// shared/lib/healthCheck.ts
// Verificar salud de servicios críticos al iniciar la app
const services = [
  { name: 'api', url: '/api/health', critical: true },
  { name: 'auth', url: '/api/auth/health', critical: true },
  { name: 'payments', url: '/api/payments/health', critical: false },
];

// Si un servicio crítico está caído → mostrar página de mantenimiento
// Si un servicio no-crítico está caído → degradar esa funcionalidad
```

### Resumen de resiliencia por capa FSD

```
shared/lib/
├── adapters/
│   └── httpAdapter.ts       # Timeout, Circuit Breaker, Retry
├── queryConfig.ts           # TanStack Query defaults (retry, staleTime, cache)
├── rateLimiter.ts           # Throttle/debounce por tipo de operación
├── logger.ts                # Logging estructurado sin datos sensibles
├── healthCheck.ts           # Verificación de servicios al inicio
└── offlineManager.ts        # Cola de mutaciones + detección de red

app/
├── providers/
│   ├── ErrorBoundary.tsx    # Error boundary global (último recurso)
│   ├── OfflineBanner.tsx    # Banner de estado de conexión
│   └── MaintenancePage.tsx  # Página cuando servicios críticos caen

widgets/
└── */ErrorFallback.tsx      # Fallback por widget (el resto sigue vivo)

features/
└── */ErrorFallback.tsx      # Fallback por feature (degradación granular)
```

---

## 8. Gestión de Estado

| Tipo | Herramienta | Ejemplo |
|---|---|---|
| Estado del servidor | TanStack Query | Lista de clientes, membresías |
| Estado de UI global | Zustand | Sidebar abierto/cerrado, theme |
| Estado de formularios | React Hook Form | Login, crear cliente |
| Estado local | useState/useReducer | Toggle, modal abierto |

### Reglas

- Fuente de verdad única por dominio
- Estado de servidor separado del estado de UI
- Cache con invalidación clara (TanStack Query)
- Sin prop drilling: usar composición o Zustand
- No guardar data sensible en localStorage sin cifrar

---

## 9. Autenticación y Seguridad

- Better-Auth para el flujo completo (register, login, OAuth, reset password)
- Rutas protegidas con middleware de TanStack Router
- Tokens/sesiones manejados por Better-Auth (httpOnly cookies)
- RBAC reflejado en la UI: roles y permisos controlan qué se renderiza
- Validación en cliente + **siempre** validar en servidor
- Sanitización de inputs contra XSS
- Nunca exponer secretos en el cliente

---

## 10. GitFlow

### Ramas

| Rama | Propósito | Protegida |
|---|---|---|
| `main` | Producción estable | ✅ PR + 1 aprobación |
| `develop` | Integración de features | ✅ PR + 1 aprobación |
| `feature/*` | Desarrollo de funcionalidades | No |
| `hotfix/*` | Fixes urgentes a producción | No |
| `release/*` | Preparación de release | No |

### Flujo de trabajo

```
1. git checkout develop && git pull origin develop
2. git checkout -b feature/nombre-descriptivo
3. Implementar cambios siguiendo FSD
4. Commit: feat(scope): descripción TG-XX
5. git push origin feature/nombre-descriptivo
6. Abrir PR → develop
7. Esperar review de @Datheon
```

### Naming de ramas

```
feature/auth-login          → Nueva funcionalidad
feature/crm-client-list     → Nueva funcionalidad
fix/login-redirect          → Bug fix
hotfix/payment-crash        → Fix urgente a producción
release/1.0.0               → Preparación de release
```

---

## 11. Conventional Commits

### Formato

```
tipo(alcance): descripción corta TG-XX #status
```

### Tipos

| Tipo | Significado |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Documentación |
| `style` | Formato (no cambia lógica) |
| `refactor` | Reestructura sin cambiar comportamiento |
| `test` | Agregar o modificar tests |
| `chore` | Mantenimiento, dependencias, configs |

### Scopes permitidos (commitlint)

```
infra/monorepo, infra/ci,
app,
pages/dashboard, pages/auth, pages/onboarding,
widgets/sidebar, widgets/header, widgets/layout,
features/auth/login, features/auth/register,
features/crm/clients, features/memberships,
features/schedule, features/billing,
entities/client, entities/membership,
entities/class, entities/payment,
shared/ui, shared/api, shared/config, shared/lib,
modules/crm, modules/memberships,
modules/schedule, modules/billing
```

### Ejemplos

```
feat(features/auth/login): add login form TG-14 #in-progress
fix(shared/api): handle 401 redirect TG-22 #done
chore(infra/monorepo): upgrade bun to 1.2 TG-5 #done
refactor(entities/client): extract validation to schema TG-30
test(features/crm/clients): add unit tests for search TG-45
```

---

## 12. Identidad del Agente Frontend

```bash
GIT_AUTHOR_NAME="datheonFrontend"
GIT_AUTHOR_EMAIL="datheonFrontend@users.noreply.github.com"
GIT_COMMITTER_NAME="datheonFrontend"
GIT_COMMITTER_EMAIL="datheonFrontend@users.noreply.github.com"
```

### Reglas del agente

1. **Siempre** usar la identidad de arriba, nunca la identidad humana
2. **Nunca** commitear directamente a `main` — siempre PR via `develop`
3. **Siempre** referenciar un issue de Taiga con `TG-XX`
4. **Siempre** seguir Conventional Commits con scope FSD
5. El token de push vive en `.env.agents` — **nunca** en código ni en commits
6. Remote con token: `https://datheonFrontend:TOKEN@github.com/Datheon/gymai.git`

### Workflow del agente

```
1. git checkout develop && git pull origin develop
2. git checkout -b feature/nombre-descriptivo
3. Implementar cambios siguiendo FSD
4. Commit: feat(scope): descripción TG-XX
5. git push origin feature/nombre-descriptivo
6. Abrir PR → develop
7. Esperar review de @Datheon
```

---

## 13. CODEOWNERS

```
*                                       @Datheon
/packages/shared/                       @Datheon @datheonFrontend
/apps/fitos-app/src/features/           @datheonFrontend
/apps/fitos-app/src/entities/           @datheonFrontend
/apps/fitos-app/src/widgets/            @datheonFrontend
/apps/fitos-app/src/pages/              @datheonFrontend
/turbo.json                             @Datheon
/biome.json                             @Datheon
/.husky/                                @Datheon
/commitlint.config.js                   @Datheon
```

---

## 14. Testing

| Tipo | Herramienta | Qué cubrir |
|---|---|---|
| Unit | Vitest | Lógica de negocio, utils, schemas Zod |
| Integración | Vitest + Testing Library | Flujos críticos de componentes |
| E2E | Playwright | Happy paths: login, crear cliente, pagar |
| Accesibilidad | axe-core + Playwright | Contraste, foco, ARIA |

### Reglas

- Coverage razonable, no forzar 100%
- Tests rápidos: feedback en menos de 1 minuto en local
- Lint + typecheck + tests en cada PR (CI)

---

## 15. Rendimiento

- Core Web Vitals monitoreados (LCP, CLS, INP)
- Code splitting por ruta (TanStack Router lo hace automático)
- Imágenes optimizadas: formato WebP/AVIF, lazy loading
- Fuentes sin bloqueo de render
- Payloads de API pequeños y paginados
- TanStack Query para cache inteligente

---

## 16. CI/CD (GitHub Actions)

```
PR abierto → Lint (Biome) → Typecheck (tsc) → Tests (Vitest) → Build → Preview deploy
Merge a main → Build → Deploy a producción
```

---

## 17. Estructura del Monorepo

```
gymai/
├── apps/
│   └── fitos-app/
│       └── src/
│           ├── app/
│           │   └── providers/
│           │       ├── ErrorBoundary.tsx
│           │       ├── OfflineBanner.tsx
│           │       └── MaintenancePage.tsx
│           ├── pages/
│           ├── widgets/
│           ├── features/
│           ├── entities/
│           └── shared/
│               └── lib/
│                   ├── adapters/
│                   │   ├── httpAdapter.ts
│                   │   ├── authAdapter.ts
│                   │   └── paymentAdapter.ts
│                   ├── queryConfig.ts
│                   ├── rateLimiter.ts
│                   ├── logger.ts
│                   ├── healthCheck.ts
│                   └── offlineManager.ts
├── packages/
│   └── shared/
├── .agent/
│   └── rules/
│       └── git.md
├── .github/
│   ├── CODEOWNERS
│   └── workflows/
├── CLAUDE.md
├── turbo.json
├── biome.json
├── commitlint.config.js
├── package.json
└── bun.lock
```

---

## 18. Checklist antes de cada PR

```
[ ] Código sigue FSD — archivos en la capa correcta
[ ] Patrones aplicados — Repository, Adapter, Factory, Facade
[ ] Error boundaries en widgets y features nuevos
[ ] TypeScript strict sin errores
[ ] Biome sin warnings
[ ] Commit sigue Conventional Commits con scope
[ ] Referencia a TG-XX de Taiga
[ ] Tests pasan localmente
[ ] Loading/error/empty states implementados
[ ] Graceful degradation si el servicio cae
[ ] Accesibilidad básica verificada
[ ] No hay secretos ni tokens en el código
[ ] No se loggea información sensible
[ ] PR va a develop, nunca directo a main
```