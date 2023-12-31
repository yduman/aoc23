import fs from "node:fs";
import events from "events";
import readline from "readline";

async function solvePart1() {
  const rl = readline.createInterface({
    input: fs.createReadStream("./input.txt"),
    crlfDelay: Infinity,
  });

  const matches: number[] = [];
  rl.on("line", line => {
    const card = line
      .split(":")[1]
      .split("|")
      .map(l => l.trim())
      .map(l => l.split(" "))
      .map(l => l.filter(x => x))
      .map(l => l.map(Number));

    const left = card[0];
    const right = card[1];

    let match = 0;
    for (const n of right) {
      if (left.includes(n)) {
        match++;
      }
    }

    matches.push(match);
  });
  await events.once(rl, "close");
  console.log(
    matches
      .filter(n => n !== 0)
      .map(n => 2 ** n / 2)
      .reduce((acc, curr) => acc + curr, 0),
  );
}

(async function main() {
  await solvePart1();
})();
