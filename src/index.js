import path from "path";
import { run } from "./run.js";

const t0 = performance.now();

const FILE_ARG = "--file=";

const args = process.argv.slice(2);  // Slice off first two elements
let filePath = args.find(arg => arg.startsWith(FILE_ARG))?.slice(FILE_ARG.length);

// If file is not provided, default to data.txt in the src directory
if (typeof filePath !== "string") {
    const __dirname = path.resolve();
    filePath = path.join(__dirname, "src/data", "data-large.txt");
}

console.log("Running against file: ", filePath);

const results = await run(filePath);

// Log the output
console.log(`\nOutput:\n${results.join("\n")}`);

const t1 = performance.now();
console.log(`\nDone in ${(t1 - t0).toFixed(2)} milliseconds.\n`);