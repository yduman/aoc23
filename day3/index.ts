import fs from "node:fs";
import events from "events";
import readline from "readline";
import { log } from "node:console";

type Point = { x: number; y: number };
type ValuePoint = Point & { value: string };

type RowNumber = { value: number; yCoords: number[] };
type RowData = { row: number; numbers: RowNumber[] };

let ROWS = 0;
let COLS = 0;
const BOARD: string[][] = [];
const SYMBOLS = /[\#\*\+\$\/\@\&\%\-]/g;

function getSurroundings(point: Point): ValuePoint[] {
  const surroundings: ValuePoint[] = [];
  const { x, y } = point;

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i >= 0 && i < ROWS && j >= 0 && j < COLS) {
        // skip the point from where we are looking
        if (i !== x || j !== y) {
          surroundings.push({ value: BOARD[i][j], x: i, y: j });
        }
      }
    }
  }

  return surroundings;
}

function checkLeftAndRight(vPoint: ValuePoint) {
  const { value, x, y } = vPoint;
  let digits: string[] = [];
  let yCoords: number[] = [];

  // check both sides for dots (single digits)
  if (y > 0 && y < COLS - 1) {
    if (BOARD[x][y - 1] === "." && BOARD[x][y + 1] === ".") {
      return { row: x, numbers: [{ value: parseInt(value), yCoords: [y] }] };
    }
  }

  // TODO: check if both sides have numbers

  // check left
  if (y > 0) {
    for (let i = y - 1; i >= 0; i--) {
      const current = BOARD[x][i];
      if (current === ".") {
        break;
      }
      digits.push(current);
      yCoords.push(i);
    }
    digits = digits.reverse();
    yCoords = yCoords.reverse();
    digits.push(value);
    yCoords.push(y);
    return { row: x, numbers: [{ value: parseInt(digits.join("")), yCoords }] };
  }

  // check right
  if (y < COLS - 1) {
    // TODO: implement
  }
}

async function solve() {
  const rl = readline.createInterface({
    input: fs.createReadStream("./example.txt"),
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    const lineSplit = line.split("");
    BOARD.push(lineSplit);
    ROWS += 1;
    COLS = lineSplit.length;
  });

  await events.once(rl, "close");

  // The lookup will have duplicates for certain scenarios
  // This result data will have all y-Coordinates for each number
  // When two or more numbers have the same y-Coordinates, we can exclude the duplicates
  const data: RowData[] = [];
  for (let i = 0; i < ROWS; i++) {
    data.push({ row: i, numbers: [] });
  }

  const symbolPoints: Point[] = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (BOARD[i][j].match(SYMBOLS)) {
        symbolPoints.push({ x: i, y: j });
      }
    }
  }

  symbolPoints.forEach((point) => {
    const surroundings = getSurroundings(point).filter(
      (p) => !Number.isNaN(Number(p.value)),
    );

    surroundings.forEach((vPoint) => {
      const rowData = checkLeftAndRight(vPoint);
      data[rowData!.row].numbers = data[rowData!.row].numbers.concat(
        rowData!.numbers,
      );
    });
  });

  log("DATA");
  log(JSON.stringify(data[0]));
}

(async function main() {
  await solve();
})();
