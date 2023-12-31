import fs from "node:fs";
import events from "events";
import readline from "readline";

let ROWS = 0;
let COLS = 0;
const BOARD: string[][] = [];

type BoardChar = { value: string; hasSymbol: boolean };

async function parseInput() {
  const rl = readline.createInterface({
    input: fs.createReadStream("./input.txt"),
    crlfDelay: Infinity,
  });
  rl.on("line", line => {
    const lineSplit = line.split("");
    BOARD.push(lineSplit);
    ROWS += 1;
    COLS = lineSplit.length;
  });
  await events.once(rl, "close");
}

function solvePart1() {
  let numbers = [];
  let chars: BoardChar[] = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const current = BOARD[i][j];

      if (isNum(current)) {
        chars.push({ value: current, hasSymbol: hasSymbolAround(i, j) });
      } else {
        if (chars.some(c => c.hasSymbol)) {
          numbers.push(chars.map(c => c.value).join(""));
        }
        chars = [];
      }
    }
  }

  console.log(
    numbers.map(n => parseInt(n)).reduce((acc, curr) => acc + curr, 0),
  );
}

function solvePart2() {
  const ratios: number[] = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const isGear = BOARD[i][j] === "*";

      if (isGear) {
        const gearVals = checkGearSurroundings(i, j);
        if (gearVals.length === 2) {
          const ratio = calculateRatio(gearVals);
          ratios.push(ratio);
        }
      } else {
        continue;
      }
    }
  }

  console.log(ratios.reduce((acc, curr) => acc + curr, 0));
}

function hasSymbolAround(x: number, y: number) {
  const surroundings: boolean[] = [];

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i >= 0 && i < ROWS && j >= 0 && j < COLS) {
        const curr = BOARD[i][j];
        if (isNaN(parseInt(curr)) && curr !== ".") {
          surroundings.push(true);
        } else {
          surroundings.push(false);
        }
      }
    }
  }

  return surroundings.some(x => x);
}

function calculateRatio(gearVals: GearVal[]) {
  return gearVals
    .map(val => {
      if (val.left.length > 0 && val.right.length > 0) {
        return val.left
          .join("")
          .concat(val.value)
          .concat(...val.right);
      } else if (val.left.length > 0) {
        return val.left.join("").concat(val.value);
      } else {
        return val.value.concat(...val.right);
      }
    })
    .map(val => parseInt(val))
    .reduce((acc, curr) => acc * curr, 1);
}

type GearVal = { value: string; left: string[]; right: string[] };

function checkGearSurroundings(x: number, y: number) {
  const gearVals: GearVal[] = [];

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i >= 0 && i < ROWS && j >= 0 && j < COLS) {
        const currentSurrounding = BOARD[i][j];
        if (isNum(currentSurrounding)) {
          const left = checkLeft(i, j);
          const right = checkRight(i, j);
          const gVal: GearVal = { value: currentSurrounding, left, right };
          gearVals.push(gVal);
          BOARD[i][j] = ".";
        }
      }
    }
  }

  return gearVals;
}

function checkLeft(x: number, y: number) {
  const result = [];

  for (let i = y - 1; y >= 0; i--) {
    const curr = BOARD[x][i];
    if (!isNum(curr)) {
      break;
    } else {
      result.push(curr);
      BOARD[x][i] = ".";
    }
  }

  return result.reverse();
}

function checkRight(x: number, y: number) {
  const result = [];

  for (let i = y + 1; y < COLS; i++) {
    const curr = BOARD[x][i];
    if (!isNum(curr)) {
      break;
    } else {
      result.push(curr);
      BOARD[x][i] = ".";
    }
  }

  return result;
}

function isNum(c: string) {
  return !isNaN(parseInt(c));
}

(async function main() {
  await parseInput();
  solvePart1();
  solvePart2();
})();
