export const validateGridSize = (gridSize) => gridSize.split(" ").map(Number).every(Number.isInteger) && gridSize.split(" ").length === 2;

export const validateRobotInstruction = (robot) => robot.match(/\(\s*\d+\s*,\s*\d+\s*,\s*[NESW]\s*\)\s+[LFR]+/);