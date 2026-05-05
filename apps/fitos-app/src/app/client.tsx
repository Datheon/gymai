// File: fitos/apps/fitos-app/src/app/client.tsx

import { StartClient } from "@tanstack/react-start/client";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);
