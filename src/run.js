import fs from "fs";
import { validateGridSize, validateRobotInstruction } from "./validations.js";

/** An array of each cardinal direction */
const directions = ["N", "E", "S", "W"];

/** Maps each orientations' change to the robots x and y position */
const move = {
    N: [0, 1],
    E: [1, 0],
    S: [0, -1],
    W: [-1, 0]
};

/** Maps a turning command to the change along the directions array */
const turn = {
    L: -1,
    R: 1
};

/**
 * Given a robots' instructions and a grid size, returns the final position of the robot
 * @param {string} robotInstructions No validation is performed so it expects a valid robot instruction (e.g., "(1, 1, E) RFRFRFRF")
 * @param {string} gridSize No validation is performed so it expects a valid grid size (e.g. "5 3")
 * @returns (x, y, orientation) | (x, y, orientation) LOST
 * @example
 * moveRobot("(1, 1, E) RFRFRFRF", "5 3"); // => "(1, 1, E)"
 * moveRobot("(0, 2, N) FFLFRFF", "4 8"); // => "(0, 4, W) LOST"
 */
export const moveRobot = (robotInstructions, gridSize) => {
    // Break down the robot instructions into its components
    const [initialState, commands] = robotInstructions.slice(1).split(") ");
    const [x, y, orientation] = initialState.split(", ");
    const [m, n] = gridSize.split(" ").map(Number);

    let lost = false;
    
    let currentDirection = directions.indexOf(orientation);
    let currentX = Number(x);
    let currentY = Number(y);
    for (let command of commands) {
        if (command === "F") {
            const [moveX, moveY] = move[directions[currentDirection]];
            const nextX = currentX + moveX;
            const nextY = currentY + moveY;
            // If the next x or y coordinate is outside the grid, the robot is lost
            if (nextX < 0 || nextX > n || nextY < 0 || nextY > m) {
                lost = true;
                break;
            }
            // Move in the current direction
            currentX += move[directions[currentDirection]][0];
            currentY += move[directions[currentDirection]][1];

        } else {
            // Ensure when turning it wraps around the array if necessary (e.g., turning left from N brings it to W).
            currentDirection = (currentDirection + turn[command] + directions.length) % directions.length;
        }
    }
    
    return `(${currentX}, ${currentY}, ${directions[currentDirection]})${lost ? " LOST" : ""}`;
}

/**
 * Given a file path, reads the file, runs the robot instructions and returns the results
 * @param {string} filePath Path to the file to read the data from (must be txt format)
 * @returns {Promise<string[]>} An array of strings representing the final position of each robot
 */
export const run = async (filePath) => {
    let fileContents = "";
    try {
        fileContents = await fs.readFileSync(filePath, "utf-8");
    } catch (err) {
        throw new Error("Error reading file: ", err);
    }

    if (typeof fileContents !== "string") {
        throw new Error("Invalid file contents: ", fileContents);
    }

    let [gridSize, ...robots] = (fileContents.includes("\r\n") ? fileContents.split("\r\n") : fileContents.split("\n")) ?? [];
    
    const isGridSizevalid = typeof gridSize === "string" && validateGridSize(gridSize)
    if (!isGridSizevalid) {
        throw new Error("Invalid grid size: ", gridSize, "Must be in the format 'm n'");
    }

    if (!robots.length) {
        throw new Error("No robot instructions found in the file");
    }

    let errors = [];
    const results = [];

    for (let robot of robots) {
        const isRobotInstructionValid = typeof robot === "string" && validateRobotInstruction(robot);
        if (!isRobotInstructionValid) {
            errors.push(`Invalid robot instruction: ${robot}`);
            continue;
        }
        results.push(moveRobot(robot, gridSize));
    }

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }

    return results;
}