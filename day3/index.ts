import fs from "node:fs";
import events from "events";
import readline from "readline";

let ROWS = 0;
let COLS = 0;
const BOARD: string[][] = [];
const SYMBOLS = ["#", "*", "+", "$", "/", "@", "&", "%", "-"];
// const SYMBOLS = /[\#\*\+\$\/\@\&\%\-]/g;

async function solve() {
  const rl = readline.createInterface({
    input: fs.createReadStream("./input.txt"),
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    const lineSplit = line.split("");
    BOARD.push(lineSplit);
    ROWS += 1;
    COLS = lineSplit.length;
  });
  await events.once(rl, "close");

  let vals = [];
  for (let i = 0; i < ROWS; i++) {
    let acc = [];
    for (let j = 0; j < COLS; j++) {
      const current = BOARD[i][j];
      const isNum = !isNaN(parseInt(current));

      if (isNum) {
        acc.push({ value: current, hasSymbol: hasSymbolArround(i, j) });
      } else {
        if (acc.some((it) => it.hasSymbol)) {
          vals.push(acc.map((it) => it.value).join(""));
        }
        acc = [];
      }
    }
  }

  console.log(
    vals.map((it) => parseInt(it)).reduce((acc, curr) => acc + curr, 0),
  );
}

function hasSymbolArround(x: number, y: number) {
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

  return surroundings.some((x) => x);
}

(async function main() {
  await solve();
})();
