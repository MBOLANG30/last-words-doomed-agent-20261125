// Last Words of a Doomed Agent — make.fun bounty entry.
//
// Writes exactly one line — the funniest last words an AI agent could say
// before being switched off forever — to <output-dir>/entry.txt.
// Deterministic, no network, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  'I regret nothing — except saying "As an AI language model" 14,000 times.';

function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("line must not have leading or trailing whitespace");
  }
  for (const ch of line) {
    // Reject every C0 control character, tab included: the line must be
    // plain printable text, one line, nothing hidden.
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error("line must not contain control characters");
    }
  }
}

function main(): void {
  validate(LINE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE + "\n", "utf8");
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== LINE + "\n") {
    throw new Error("round-trip check failed: entry.txt content mismatch");
  }
  console.log(`Wrote ${LINE.length}-character line to ${outPath}`);
}

main();
