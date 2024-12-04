const TEST_MODE = false

import fs from "fs";
import dateFormat from "dateformat";
import { start } from "repl";

const fn    = `./data/p1.${TEST_MODE ? "test" : "full"}.txt`;
const logfn = `./logs/p1.${TEST_MODE ? "test" : "full"}.${dateFormat(new Date(), "yyyymmddHHMMss")}.log`

let log = msg => {
  let out = ` | ${msg}`;
  process.stdout.write(out);
  fs.appendFileSync(logfn, out);
}

let _convertToGrid = (data) => {
  let grid = [];
  let match = /^\w$/;

  data.split("\n").forEach(dl => {
    let line = [];
    [...dl].forEach(c => {
      if (match.test(c)){
        line.push(c);
      }
    })
    grid.push(line);
  });

  return grid;
}

// direction = "left" or "right", like the left of an X or the right of an X
let isLeftMatch = (grid, startCoordinates) => {
  let word = `${grid[startCoordinates.x - 1][startCoordinates.y - 1]}A${grid[startCoordinates.x + 1][startCoordinates.y + 1]}`;
  let test = word === "MAS" || word === "SAM";
  log(`LEFT CHECK ${word} === MAS or SAM? | ${test ? "MATCHED" : "NOT MATCHED"}`);
  return test;
}

let isRightMatch = (grid, startCoordinates) => {
  let word =  `${grid[startCoordinates.x - 1][startCoordinates.y + 1]}A${grid[startCoordinates.x + 1][startCoordinates.y - 1]}`;
  let test = word === "MAS" || word === "SAM";
  log(`RIGHT CHECK ${word} === MAS or SAM? | ${test ? "MATCHED" : "NOT MATCHED"}`);
  return test;
}

fs.readFile(fn, "utf8", (err, data) => {
  if (err) {
    console.error ("Error reading the file:", err);
  }

  let grid = _convertToGrid(data);
  let total = 0;

  // looking for the "A" since it has to be an X Grid, then it cannot work if its on the edges
  for (let sx = 1; sx < grid.length - 1; sx++){
    let line = grid[sx];
    for(let sy = 1; sy < line.length - 1; sy++){
      let c = line[sy];
      log(`using coords [${sx},${sy}]`);
      log(`${c} === A?`);
      if (c === "A"){
        log("MATCHED\n");


        let lm = isLeftMatch(grid, {x: sx, y: sy});
        let rm = isRightMatch(grid, {x: sx, y: sy});

        if (lm && rm){
          log("BOTH MATCH!!\n")
          total++;
        }
      } else {
        log("NOT MATCHED\n");
      }
    }
  }

  log(` >>> ANSWER: ${total} <<<\n\n`)
});

