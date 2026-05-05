// File: fitos/taiga-add-tasks.js
// File: taiga-add-tasks.js
// Usage: node taiga-add-tasks.js
// Adds tasks to a specific user story in Taiga

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc3OTM0NTM0LCJqdGkiOiIxYWVhYzdlNWNmNGM0MjdmYWYxYzFiMWVmMWRmZDUwMSIsInVzZXJfaWQiOjkzMTE1MX0.TvSvidneoqKPVsM0rx4xbWzz8HWFCrTCya3U2xUZtaY5SIJ2LuOGDRBqoggyEtpAAQavCC-o0PAHR7FoEDjJULulLa6NjQKcbvRgbWgLd2k1fvH5G1CvkvH28qHUa7D1ccXqIztY5QiGRA1favq4q0ugerk6_tj-k57f9G9eqsNUa5H9YRLOrlwarsB3t2kb7Pg2cYXpyvIYzzNMxt9TmWpag5XsUhBt57pZdQMOClqk3Q9G6IxnQeU9qsqBSyXyEZV5UzJiTqz_kunMx1OZ1-cz4JqfT7dVevCSDx0T8geaewxW-kFs84F6bl_FWjZz6fy2AHN_15MUTxkwPzSMNw";
const SLUG = "datheon-gymai";
const BASE = "https://api.taiga.io/api/v1";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

// ═══════════════════════════════════════════════════════════
// CONFIGURA AQUÍ — Cambia el US_NUMBER y las tasks
// ═══════════════════════════════════════════════════════════

const US_NUMBER = 54; // ← Número de la User Story en Taiga

const tasks = [
  "Verify root package.json has workspaces configured for apps/* and packages/*",
  "Create apps/fitos-app/package.json with TanStack Start dependencies",
  "Run bun install from root to resolve all dependencies via workspaces",
  "Create app.config.ts with TanStack Start + Vinxi configuration",
  "Create tsconfig.json with TypeScript strict mode for fitos-app",
  "Create src/app/router.tsx with TanStack Router configuration",
  "Create src/app/entry-client.tsx with client hydration",
  "Create src/app/entry-server.tsx with SSR handler",
  "Create src/pages/index.tsx as root route (hello world)",
  "Create FSD folder structure (app, pages, widgets, features, entities, shared)",
  "Add dev script and verify app runs with bun run dev",
  "Clean up junk files from root (and, touch, test.txt, taiga-setup.js)",
  "Create feature branch, commit with agent identity, open PR to develop",
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
  // 1. Get project info
  console.log("🔍 Getting project info...");
  const project = await get(`/projects/by_slug?slug=${SLUG}`);
  if (!project) {
    console.error("❌ Could not fetch project.");
    process.exit(1);
  }

  const projectId = project.id;
  console.log(`✅ Project: ${project.name} (ID: ${projectId})`);

  // 2. Build task status map
  const taskStatusMap = {};
  for (const s of project.task_statuses || []) {
    taskStatusMap[s.slug] = s.id;
  }
  console.log("📋 Task statuses:", Object.keys(taskStatusMap).join(", "));

  // 3. Find the user story by ref number
  console.log(`\n🔍 Looking for US #${US_NUMBER}...`);
  const usResult = await get(
    `/userstories/by_ref?ref=${US_NUMBER}&project=${projectId}`,
  );
  if (!usResult) {
    console.error(`❌ Could not find US #${US_NUMBER}`);
    process.exit(1);
  }

  const usId = usResult.id;
  const milestoneId = usResult.milestone;
  console.log(`✅ Found: "${usResult.subject}" (ID: ${usId})`);

  // 4. Check existing tasks
  console.log("\n📋 Checking existing tasks...");
  const existingTasks = await get(
    `/tasks?user_story=${usId}&project=${projectId}`,
  );
  const existingTitles = new Set((existingTasks || []).map((t) => t.subject));

  if (existingTitles.size > 0) {
    console.log(`  ⚠️  Found ${existingTitles.size} existing tasks`);
  }

  // 5. Create tasks
  console.log(`\n🚀 Adding ${tasks.length} tasks to US #${US_NUMBER}...\n`);

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < tasks.length; i++) {
    const taskTitle = tasks[i];

    // Skip if already exists
    if (existingTitles.has(taskTitle)) {
      console.log(
        `  ⏭️  [${i + 1}/${tasks.length}] Already exists: ${taskTitle}`,
      );
      skipped++;
      continue;
    }

    const result = await post("/tasks", {
      project: projectId,
      user_story: usId,
      milestone: milestoneId,
      subject: taskTitle,
      status: taskStatusMap["new"] || Object.values(taskStatusMap)[0],
    });

    if (result) {
      console.log(`  ✅ [${i + 1}/${tasks.length}] ${taskTitle}`);
      created++;
    } else {
      console.log(`  ❌ [${i + 1}/${tasks.length}] FAILED: ${taskTitle}`);
    }

    await sleep(200);
  }

  // 6. Summary
  console.log(`\n${"═".repeat(50)}`);
  console.log(`🎉 Done!`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(
    `   📋 Total tasks in US: ${created + skipped + existingTitles.size}`,
  );
  console.log(`\n👉 https://tree.taiga.io/project/${SLUG}/us/${US_NUMBER}`);
}

main().catch(console.error);
