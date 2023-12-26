import fs from "node:fs";
import events from "events";
import readline from "readline";

const R_MAX = 12;
const G_MAX = 13;
const B_MAX = 14;

type Color = "red" | "green" | "blue";
type Grab = { count: number; color: Color; ok?: boolean };

function isOk(count: number, color: Color) {
  switch (color) {
    case "red":
      return count <= R_MAX;
    case "green":
      return count <= G_MAX;
    case "blue":
      return count <= B_MAX;
  }
}

function getCountsByColor(gameplay: Grab[][], color: Color) {
  return gameplay.flatMap((play) =>
    play.filter((p) => p.color === color).map((p) => p.count),
  );
}

async function solvePart1() {
  const rl = readline.createInterface({
    input: fs.createReadStream("./input.txt"),
    crlfDelay: Infinity,
  });

  let acc = 0;
  const regex = /(\d+)\s+(\w+)/g;

  rl.on("line", (line) => {
    const game = parseInt(line.split(":")[0].split(" ")[1]);
    const gameplay = line
      .split(":")[1]
      .split(";")
      .map((s) => s.trim())
      .map((s) => {
        return s.match(regex)!.map((m) => {
          const [count, color] = m.split(" ");
          const countAsNum = parseInt(count);
          return {
            count: countAsNum,
            color,
            ok: isOk(countAsNum, color as Color),
          } as Grab;
        });
      });

    if (gameplay.every((play) => play?.every((grab) => grab.ok))) {
      acc += game;
    }
  });

  await events.once(rl, "close");
  console.log(`Result: ${acc}`);
}

async function solvePart2() {
  const rl = readline.createInterface({
    input: fs.createReadStream("./input.txt"),
    crlfDelay: Infinity,
  });

  let acc = 0;
  const regex = /(\d+)\s+(\w+)/g;

  rl.on("line", (line) => {
    const game = parseInt(line.split(":")[0].split(" ")[1]);
    const gameplay = line
      .split(":")[1]
      .split(";")
      .map((s) => s.trim())
      .map((s) => {
        return s.match(regex)!.map((m) => {
          const [count, color] = m.split(" ");
          const countAsNum = parseInt(count);
          return {
            count: countAsNum,
            color: color as Color,
          } as Grab;
        });
      });

    const reds = getCountsByColor(gameplay, "red");
    const greens = getCountsByColor(gameplay, "green");
    const blues = getCountsByColor(gameplay, "blue");

    const maxRed = Math.max(...reds);
    const maxGreen = Math.max(...greens);
    const maxBlues = Math.max(...blues);

    acc += maxRed * maxGreen * maxBlues;
  });

  await events.once(rl, "close");
  console.log(`Result: ${acc}`);
}

(async function solve() {
  // await solvePart1();
  await solvePart2();
})();
