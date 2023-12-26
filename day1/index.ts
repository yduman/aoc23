import fs from "node:fs";
import events from "events";
import readline from "readline";

const DICT: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

(async function solve() {
  const rl = readline.createInterface({
    input: fs.createReadStream("./input.txt"),
    crlfDelay: Infinity,
  });

  const regex = `\\d|` + Object.keys(DICT).join("|");
  let acc = 0;
  rl.on("line", (line) => {
    const parsed = parseInt(
      line
        .match(`(?=(${regex})).*(${regex})`)
        ?.map((val) => Number(val) || DICT[val])
        .splice(1, 2)
        .join("")!,
    );
    acc += parsed;
  });

  await events.once(rl, "close");
  console.log(`Result: ${acc}`);
})();
