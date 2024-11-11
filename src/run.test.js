import { after, before, describe, it } from "node:test";
import assert from "node:assert";
import { moveRobot, run } from "./run.js";

describe("run", () => {
    it("Should successfully run the program given a valid file - small", async () => {
        const filePath = "src/data/data-small.txt";
        const results = await run(filePath);
        assert.equal(results[0], "(4, 4, E)");
        assert.equal(results.length, 2);
    });

    it("Should successfully run the program given a valid file - large", async () => {
        const filePath = "src/data/data-large.txt";
        const results = await run(filePath);
        assert.equal(results[0], "(4, 4, E)");
        assert.equal(results.length, 9750);
    });
    
    it("Should fail if given an invalid file path", async () => {
        const filePath = "src/data/data-missing.txt";
        assert.rejects(async () => {
            await run(filePath)
        });
    });
    
    ["data-invalid-grid-size", "data-invalid-robot-instructions"].forEach((file) => {
        it(`Should fail if the file ${file} is invalid`, async () => {
            const filePath = `src/data/${file}.txt`;
            assert.rejects(async () => {
                await run(filePath)
            });
        });
    });
});

describe("moveRobot", () => {
    [
        ["4 8", "(2, 3, N) FLLFR", "(2, 3, W)", "Task requirement"],
        ["4 8", "(1, 0, S) FFRLF", "(1, 0, S) LOST", "Task requirement"],
        ["4 8", "(1, 0, E) ", "(1, 0, E)", "No movement"],
        ["4 8", "(1, 0, E) LRL", "(1, 0, N)", "Turn without moving"],
        ["4 8", "(1, 0, E) F", "(2, 0, E)", "Move forward"],
        ["4 8", "(0, 0, S) FFFF", "(0, 0, S) LOST", "Cross boundary"],
        ["4 4", "(0, 0, N) FFFFRFFFFRFFFFRFFFF", "(0, 0, W)", "Full circumference of grid"],
        ["4 4", "(4, 3, N) FFLFLFFF", "(4, 4, N) LOST", "Moves off grid but comes back"],
        ["120 318", "(215, 101, N) FFFRFFF", "(218, 104, E)", "Large grid"]
    ].forEach(([gridSize, robotInstructions, expected, description]) => {
        it(`Should return ${expected} given ${robotInstructions} on a grid of size ${gridSize} - ${description}`, () => {
            const result = moveRobot(robotInstructions, gridSize);
            assert.equal(result, expected);
        });
    });
});