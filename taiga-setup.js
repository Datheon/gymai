const TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc3ODM0MjkyLCJqdGkiOiJlYTQ1YmQxMmFmMWQ0NDMzYWYxODA3Y2UwNTBkZWFhMCIsInVzZXJfaWQiOjkzMTE1MX0.ZshN7m_KGKcgngQ6Nn3N38XoIgYpH5v4xsoaAVEE4boqPWPpih2yeUaqhTwWuGwgIbQ6vQ9U6Qy4U8KBW6S163BXBgse5WnVPn4dNAARuAb6xNzB9-B5uwhUOqU8op9VA62tAiVBNm6AiRRkhkwmydstXviDdwIlcoT-RTJfrwNzKJZQpcDHspXGxycmeHmdX99fsSlS-wp54asoqRYegC1cqUwx-gxXx-WLe4pccx1YbFDNu1zYEZUfr90ThINoVZPuOit3UOhfoUeou5oNAHcgbBVXEsiJ9ZQ_QUEOnScOvUQPNMtFgTby8AuwsONlXQT_CcGwI505_pgzfQa1BA";
const SLUG = "datheon-gymai";
const BASE = "https://api.taiga.io/api/v1";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const epics = [
  { title: "Infrastructure & Scaffold", color: "#6C757D" },
  { title: "Authentication & Onboarding", color: "#0D6EFD" },
  { title: "General Dashboard", color: "#6610F2" },
  { title: "CRM — Clients", color: "#0DCAF0" },
  { title: "Memberships & Plans", color: "#198754" },
  { title: "Schedule & Classes", color: "#FFC107" },
  { title: "Payments & Billing", color: "#DC3545" },
];

const sprints = [
  {
    name: "Sprint 1 — Infrastructure & Scaffold",
    start: "2026-05-01",
    end: "2026-05-07",
    stories: [
      {
        title: "As a dev I want the monorepo configured with Turborepo and Bun",
        epic: "Infrastructure & Scaffold",
        points: 1,
        status: "done",
      },
      {
        title: "As a dev I want Biome configured for linting and formatting",
        epic: "Infrastructure & Scaffold",
        points: 1,
        status: "done",
      },
      {
        title: "As a dev I want Husky + Commitlint + Commitizen working",
        epic: "Infrastructure & Scaffold",
        points: 1,
        status: "done",
      },
      {
        title:
          "As a dev I want GitFlow configured with develop and feature branches",
        epic: "Infrastructure & Scaffold",
        points: 1,
        status: "done",
      },
      {
        title: "As a dev I want AI agents configured with GitHub identities",
        epic: "Infrastructure & Scaffold",
        points: 1,
        status: "done",
      },
      {
        title: "As a dev I want TanStack Start installed and running",
        epic: "Infrastructure & Scaffold",
        points: 2,
        status: "new",
      },
      {
        title: "As a dev I want strict TypeScript configured across the app",
        epic: "Infrastructure & Scaffold",
        points: 1,
        status: "new",
      },
      {
        title: "As a dev I want the FSD folder structure created",
        epic: "Infrastructure & Scaffold",
        points: 2,
        status: "new",
      },
      {
        title: "As a dev I want shared UI kit base with shadcn and Tailwind",
        epic: "Infrastructure & Scaffold",
        points: 2,
        status: "new",
      },
      {
        title: "As a dev I want the design tokens defined in Tailwind",
        epic: "Infrastructure & Scaffold",
        points: 1,
        status: "new",
      },
      {
        title:
          "As a dev I want CLAUDE.md with project conventions for AI agents",
        epic: "Infrastructure & Scaffold",
        points: 1,
        status: "new",
      },
    ],
  },
  {
    name: "Sprint 2 — Authentication & Onboarding",
    start: "2026-05-08",
    end: "2026-05-14",
    stories: [
      {
        title: "As a user I want to register with email and password",
        epic: "Authentication & Onboarding",
        points: 2,
        status: "new",
      },
      {
        title: "As a user I want to log in with email and password",
        epic: "Authentication & Onboarding",
        points: 2,
        status: "new",
      },
      {
        title: "As a user I want to log in with Google OAuth",
        epic: "Authentication & Onboarding",
        points: 2,
        status: "new",
      },
      {
        title: "As a user I want to reset my password via email",
        epic: "Authentication & Onboarding",
        points: 2,
        status: "new",
      },
      {
        title: "As a user I want protected routes to redirect me to login",
        epic: "Authentication & Onboarding",
        points: 1,
        status: "new",
      },
      {
        title: "As a user I want an onboarding flow after first login",
        epic: "Authentication & Onboarding",
        points: 3,
        status: "new",
      },
      {
        title: "As an admin I want to manage roles and permissions (RBAC)",
        epic: "Authentication & Onboarding",
        points: 3,
        status: "new",
      },
      {
        title: "As a user I want my session to persist across page reloads",
        epic: "Authentication & Onboarding",
        points: 1,
        status: "new",
      },
    ],
  },
  {
    name: "Sprint 3 — Dashboard & CRM",
    start: "2026-05-15",
    end: "2026-05-21",
    stories: [
      {
        title: "As an admin I want a general dashboard with key metrics",
        epic: "General Dashboard",
        points: 3,
        status: "new",
      },
      {
        title: "As an admin I want to see active members count on dashboard",
        epic: "General Dashboard",
        points: 1,
        status: "new",
      },
      {
        title: "As an admin I want to see revenue summary on dashboard",
        epic: "General Dashboard",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to see today scheduled classes on dashboard",
        epic: "General Dashboard",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to see the list of clients",
        epic: "CRM — Clients",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to create a new client",
        epic: "CRM — Clients",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to edit a client information",
        epic: "CRM — Clients",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to search and filter clients",
        epic: "CRM — Clients",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to see a client full profile and history",
        epic: "CRM — Clients",
        points: 3,
        status: "new",
      },
      {
        title: "As an admin I want to add notes to a client",
        epic: "CRM — Clients",
        points: 1,
        status: "new",
      },
    ],
  },
  {
    name: "Sprint 4 — Memberships, Schedule & Billing",
    start: "2026-05-22",
    end: "2026-05-28",
    stories: [
      {
        title: "As an admin I want to create membership plans",
        epic: "Memberships & Plans",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to assign a membership to a client",
        epic: "Memberships & Plans",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to see active and expired memberships",
        epic: "Memberships & Plans",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to renew a client membership",
        epic: "Memberships & Plans",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to create classes on the schedule",
        epic: "Schedule & Classes",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to assign an instructor to a class",
        epic: "Schedule & Classes",
        points: 1,
        status: "new",
      },
      {
        title: "As a client I want to book a class from the schedule",
        epic: "Schedule & Classes",
        points: 3,
        status: "new",
      },
      {
        title: "As an admin I want to see class attendance",
        epic: "Schedule & Classes",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to process a payment for a membership",
        epic: "Payments & Billing",
        points: 3,
        status: "new",
      },
      {
        title: "As an admin I want to see payment history per client",
        epic: "Payments & Billing",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to generate an invoice for a payment",
        epic: "Payments & Billing",
        points: 2,
        status: "new",
      },
      {
        title: "As an admin I want to handle failed payments with grace period",
        epic: "Payments & Billing",
        points: 3,
        status: "new",
      },
    ],
  },
];

async function get(url) {
  const res = await fetch(`${BASE}${url}`, { headers });
  const data = await res.json();
  if (!res.ok) {
    console.error(`GET ${url} failed:`, JSON.stringify(data));
    return null;
  }
  return data;
}

async function post(url, body) {
  const res = await fetch(`${BASE}${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`POST ${url} failed:`, JSON.stringify(data));
    return null;
  }
  return data;
}

async function del(url) {
  const res = await fetch(`${BASE}${url}`, { method: "DELETE", headers });
  return res.ok;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🔍 Getting project info...");
  const project = await get(`/projects/by_slug?slug=${SLUG}`);
  if (!project) {
    console.error("❌ Could not fetch project.");
    process.exit(1);
  }

  const projectId = project.id;
  console.log(`✅ Project: ${project.name} (ID: ${projectId})`);

  // Build status map
  const statusMap = {};
  for (const s of project.us_statuses || []) statusMap[s.slug] = s.id;
  console.log("📋 Statuses:", Object.keys(statusMap).join(", "));

  // Build epic status map
  const epicStatusMap = {};
  for (const s of project.epic_statuses || []) epicStatusMap[s.slug] = s.id;

  // Delete existing sprints
  console.log("\n🗑️  Deleting existing sprints...");
  const existingSprints = await get(`/milestones?project=${projectId}`);
  for (const sprint of existingSprints || []) {
    const deleted = await del(`/milestones/${sprint.id}`);
    console.log(`  ${deleted ? "✅" : "❌"} Deleted sprint: ${sprint.name}`);
    await sleep(300);
  }

  // Fetch existing epics
  console.log("\n📌 Fetching existing epics...");
  const existingEpics = await get(`/epics?project=${projectId}`);
  const epicMap = {};
  for (const e of existingEpics || []) {
    epicMap[e.subject] = e.id;
    console.log(`  ⏭️  Found: ${e.subject} (ID: ${e.id})`);
  }

  // Create missing epics
  for (const epic of epics) {
    if (epicMap[epic.title]) continue;
    const created = await post("/epics", {
      project: projectId,
      subject: epic.title,
      color: epic.color,
      status: epicStatusMap["new"],
    });
    if (created) {
      epicMap[epic.title] = created.id;
      console.log(`  ✅ Epic created: ${epic.title} (ID: ${created.id})`);
    }
    await sleep(300);
  }

  // Create sprints and user stories
  for (const sprint of sprints) {
    console.log(`\n🏃 Creating sprint: ${sprint.name}`);
    const createdSprint = await post("/milestones", {
      project: projectId,
      name: sprint.name,
      estimated_start: sprint.start,
      estimated_finish: sprint.end,
    });

    if (!createdSprint) {
      console.log(`  ⚠️  Sprint failed, skipping.`);
      continue;
    }

    const sprintId = createdSprint.id;
    console.log(`  ✅ Sprint created (ID: ${sprintId})`);

    for (const story of sprint.stories) {
      const statusId = statusMap[story.status] || statusMap["new"];
      const epicId = epicMap[story.epic] || null;
      const created = await post("/userstories", {
        project: projectId,
        subject: story.title,
        milestone: sprintId,
        status: statusId,
        epic: epicId,
      });
      if (created) console.log(`    ✅ US: ${story.title.slice(0, 55)}...`);
      await sleep(200);
    }
  }

  console.log("\n🎉 Taiga setup complete!");
  console.log(`👉 https://taiga.io/project/${SLUG}/backlog`);
}

main().catch(console.error);
