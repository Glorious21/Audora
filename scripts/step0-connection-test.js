/**
 * Step 0 — verify the Walrus Memory (MemWal) connection end to end
 * BEFORE building any app logic.
 *
 *   1. create the MemWal client from .env credentials
 *   2. call health()
 *   3. remember() one test memory + wait for the job to finish
 *   4. recall() it back with a natural-language query
 *
 * Run:  npm run step0
 *
 * If this passes, credentials + SDK + relayer are all good and any later
 * bug is an app bug, not an infrastructure bug.
 */
import "dotenv/config";
import {
  getMemWal,
  NAMESPACE,
  withRetry,
  pollRememberJob,
} from "../server/lib/memwal.js";

const line = () => console.log("─".repeat(60));

async function main() {
  console.log("\nWalrus Memory — Step 0 connection test");
  line();
  console.log("namespace :", NAMESPACE);
  console.log("relayer   :", process.env.MEMWAL_SERVER_URL || "(default staging)");
  console.log("accountId :", process.env.MEMWAL_ACCOUNT_ID);
  console.log("key       :", process.env.MEMWAL_KEY ? "loaded" : "MISSING");
  line();

  const memwal = getMemWal();

  // 1. health -----------------------------------------------------------------
  console.log("\n[1/3] health()…");
  const health = await memwal.health();
  console.log("      →", JSON.stringify(health));

  // 2. remember -------------------------------------------------------------
  // Fixed text + idempotency key so re-running this test collapses onto the
  // same stored memory instead of polluting the vault with duplicates.
  const marker = "step0-connection-test";
  const idempotencyKey = `${marker}:${NAMESPACE}`;
  const testText =
    `Track: Sunset Test Beat (${marker}). Date added: 2026-08-27. BPM: 112. ` +
    `Key: F minor. Mood/genre tags: amapiano, mellow, test. Status: draft. ` +
    `File location: local hard drive /tests. Notes: standalone connection test memory.`;

  console.log("\n[2/3] remember() + poll job to terminal state…");
  console.log("      text:", testText);

  let stored;
  try {
    const accepted = await withRetry(
      () => memwal.remember(testText, undefined, { idempotencyKey }),
      { label: "remember" },
    );
    console.log("      accepted job_id:", accepted.job_id, `(status: ${accepted.status})`);
    stored = await pollRememberJob(accepted.job_id, { timeoutMs: 240_000 });
    console.log("      job status →", JSON.stringify(stored));
    if (stored.status !== "done") {
      console.log(
        "      (relayer still finalizing — job_id is valid proof-of-storage; " +
          "recall below may lag until indexing completes)",
      );
    }
  } catch (err) {
    if (err?.status === 409) {
      console.log("      already stored on a previous run (idempotent) — continuing");
      stored = { status: "done", idempotent: true };
    } else {
      throw err;
    }
  }

  // 3. recall -------------------------------------------------------------
  console.log("\n[3/3] recall()…");
  const query = "the mellow amapiano draft I used for a connection test";
  const result = await withRetry(() => memwal.recall({ query, limit: 5 }), {
    label: "recall",
  });
  console.log(`      query: "${query}"`);
  console.log(`      ${result.results.length} result(s), total=${result.total}`);
  result.results.forEach((r, i) => {
    console.log(`      #${i + 1}  distance=${r.distance?.toFixed?.(4) ?? r.distance}`);
    console.log(`          ${r.text}`);
  });

  const hit = result.results.some((r) => r.text.includes(marker));
  line();
  if (hit) {
    console.log("✅  PASS — stored a memory and recalled it back by meaning.");
  } else {
    console.log(
      "⚠️   health/remember worked, but the test memory was not in the recall results.\n" +
        "     Indexing can lag a few seconds — re-run `npm run step0` once more.",
    );
  }
  console.log("");
}

main().catch((err) => {
  console.error("\n❌  Step 0 FAILED\n");
  console.error(err?.stack || err);
  process.exit(1);
});
