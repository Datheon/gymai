// File: fitos/apps/fitos-app/src/app/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>GymAI - Fitos</title>
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
