import fs from "node:fs";
import events from "events";
import readline from "readline";

type Card = { left: number[]; right: number[] };
const CARDS: Card[] = [];

type CardMatch = [number, number];

async function parseInput() {
  const rl = readline.createInterface({
    input: fs.createReadStream("./input.txt"),
    crlfDelay: Infinity,
  });

  rl.on("line", line => {
    const card = line
      .split(":")[1]
      .split("|")
      .map(l => l.trim())
      .map(l => l.split(" "))
      .map(l => l.filter(x => x))
      .map(l => l.map(Number));

    CARDS.push({ left: card[0], right: card[1] });
  });
  await events.once(rl, "close");
}

async function solvePart1() {
  const matches: number[] = [];

  CARDS.forEach(card => {
    matches.push(card.right.filter(n => card.left.includes(n)).length);
  });

  console.log(
    matches
      .filter(n => n !== 0)
      .map(n => 2 ** n / 2)
      .reduce((acc, curr) => acc + curr, 0),
  );
}

async function solvePart2() {
  const scratchCards: number[] = new Array(CARDS.length).fill(1);

  CARDS.forEach((card, idx) => {
    const matchCount = card.right.filter(n => card.left.includes(n)).length;

    if (matchCount) {
      for (let i = idx + 1; i < idx + 1 + matchCount; i++) {
        if (scratchCards[i]) {
          scratchCards[i] += scratchCards[idx] || 0;
        }
      }
    }
  });

  console.log(scratchCards.reduce((acc, curr) => acc + curr, 0));
}

(async function main() {
  await parseInput();
  console.log("==== Solution Part 1 ====");
  await solvePart1();
  console.log("==== Solution Part 2 ====");
  await solvePart2();
})();
