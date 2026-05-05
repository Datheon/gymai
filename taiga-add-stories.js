// File: fitos/taiga-add-stories.js
// File: taiga-add-stories.js
// Usage: bun run taiga-add-stories.js

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc3OTU1NTk3LCJqdGkiOiI0N2RkMzQ1ZjU3ODM0ZDc5YjkxZTIzM2ZjZmVmYzVmMiIsInVzZXJfaWQiOjkzMTE1MX0.WnOY7-BoSTurlej4AFQlVmjsyKsxv6x-YLCziKTrlQOaxBRuJ7jd-N6WC33lnuWeKNLLTYz8A3YhbTO7o_NnmVGSU5WSLqtHpAaBkx6PjJyKzIPcna5Z2w2a42kW4X5s2uxrbvZAyIka2tadu7AaIeKrJ5LaMK6ex9a7Fd5yrq4GDZ9sX9q7piWgtZuAHuVigoJW1OApln5o5BzDqxBIbhe5_gjK4MSTGIzY2qF0XjQ8e-jzvhr0ScAn-CHNugEG3mUP0fdCECewbxfraBdN14Pg-F-HKpbuqQPwiUqaTB83nPR4o56Gafnn0949-Zn0w4AE19m94ixNizFf-JbqUg";
const SLUG = "datheon-gymai";
const BASE = "https://api.taiga.io/api/v1";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

// ═══════════════════════════════════════════════════════════
// NEW USER STORIES + TASKS FOR SPRINT 1
// ═══════════════════════════════════════════════════════════

const newStories = [
  {
    title:
      "As a dev I want CI/CD pipeline with GitHub Actions for automated checks",
    epic: "Infrastructure & Scaffold",
    points: 3,
    tags: [
      "type:infrastructure",
      "layer:frontend",
      "priority:critical",
      "gitflow:feature",
    ],
    tasks: [
      "Create .github/workflows/ci.yml for PR checks",
      "Configure Biome lint step in CI",
      "Configure TypeScript typecheck step in CI",
      "Configure Vitest test step in CI",
      "Configure build step in CI",
      "Test CI pipeline with a dummy PR",
      "Document CI pipeline in CLAUDE.md",
    ],
  },
  {
    title: "As a dev I want Vitest configured with a first test",
    epic: "Infrastructure & Scaffold",
    points: 2,
    tags: [
      "type:infrastructure",
      "layer:frontend",
      "priority:high",
      "gitflow:feature",
    ],
    tasks: [
      "Install vitest and @testing-library/react",
      "Create vitest.config.ts in fitos-app",
      "Add test script to fitos-app package.json",
      "Create first unit test in shared/lib",
      "Verify tests run with bun run test",
    ],
  },
  {
    title:
      "As a dev I want environment configs for dev, staging and production",
    epic: "Infrastructure & Scaffold",
    points: 2,
    tags: [
      "type:infrastructure",
      "layer:frontend",
      "priority:high",
      "gitflow:feature",
    ],
    tasks: [
      "Create .env.example with all required variables",
      "Create .env.development with dev defaults",
      "Create .env.staging with staging config",
      "Create .env.production with production config",
      "Create shared/config/env.ts with Zod validation for env vars",
      "Add .env* to .gitignore (except .env.example)",
      "Document environment setup in CLAUDE.md",
    ],
  },
];

// ═══════════════════════════════════════════════════════════

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

  const taskStatusMap = {};
  for (const s of project.task_statuses || []) taskStatusMap[s.slug] = s.id;

  // Find Sprint 1
  console.log("\n🔍 Finding Sprint 1...");
  const milestones = await get(`/milestones?project=${projectId}`);
  const sprint1 = milestones.find((m) => m.name.includes("Sprint 1"));
  if (!sprint1) {
    console.error("❌ Sprint 1 not found");
    process.exit(1);
  }
  console.log(`✅ Sprint 1 found (ID: ${sprint1.id})`);

  // Find epic
  const epics = await get(`/epics?project=${projectId}`);
  const epicMap = {};
  for (const e of epics || []) epicMap[e.subject] = e.id;

  // Create stories and tasks
  for (const story of newStories) {
    console.log(`\n📝 Creating US: ${story.title.slice(0, 60)}...`);

    const epicId = epicMap[story.epic] || null;
    const createdUS = await post("/userstories", {
      project: projectId,
      subject: story.title,
      milestone: sprint1.id,
      status: statusMap["new"],
      epic: epicId,
      tags: story.tags,
    });

    if (!createdUS) {
      console.log("  ❌ Failed to create US");
      continue;
    }
    console.log(`  ✅ US created (ref: #${createdUS.ref})`);

    // Create tasks
    for (const taskTitle of story.tasks) {
      await post("/tasks", {
        project: projectId,
        user_story: createdUS.id,
        milestone: sprint1.id,
        subject: taskTitle,
        status: taskStatusMap["new"],
      });
      await sleep(150);
    }
    console.log(`  📋 ${story.tasks.length} tasks created`);
    await sleep(200);
  }

  console.log("\n🎉 Done! New stories added to Sprint 1");
  console.log(`👉 https://tree.taiga.io/project/${SLUG}/backlog`);
}

main().catch(console.error);
