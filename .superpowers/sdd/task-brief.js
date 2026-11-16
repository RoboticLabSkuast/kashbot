// .superpowers/sdd/task-brief.js
const fs = require('fs');
const path = require('path');

const [,, planFile, taskNum, customOut] = process.argv;
if (!planFile || !taskNum) {
  console.error("Usage: node task-brief.js PLAN_FILE TASK_NUM [OUTFILE]");
  process.exit(1);
}

const content = fs.readFileSync(planFile, 'utf8');
const lines = content.split(/\r?\n/);
let inTask = false;
let taskLines = [];
let inFence = false;

for (let line of lines) {
  if (line.startsWith('```')) {
    inFence = !inFence;
  }
  if (!inFence && line.match(/^#+\s+Task\s+\d+/i)) {
    const m = line.match(/^#+\s+Task\s+(\d+)/i);
    inTask = (m && m[1] === String(taskNum));
  }
  if (inTask) {
    taskLines.push(line);
  }
}

if (taskLines.length === 0) {
  console.error(`Task ${taskNum} not found in ${planFile}`);
  process.exit(1);
}

const outPath = customOut || path.join(__dirname, `task-${taskNum}-brief.md`);
fs.writeFileSync(outPath, taskLines.join('\n'), 'utf8');
console.log(`wrote ${outPath}: ${taskLines.length} lines`);
