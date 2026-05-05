// File: fitos/apps/fitos-app/src/app/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1>GymAI - Fitos</h1>
      <p>TanStack Start running</p>
    </div>
  );
}
