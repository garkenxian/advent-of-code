const TEST_MODE = false

import fs from "fs";
import dateFormat from "dateformat";

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

let searchMath = () => {
  let searchGrid = [];

  for(let x = -1; x <= 1; x++){
    for(let y = -1; y <= 1; y++){
      if (!(x === 0 && y === 0)){
        searchGrid.push({
          x : x,
          y : y
        });
      }

    }
  }

  return searchGrid;
}

let isValidCoordinates = (grid, testCoordinates)=> {
  let xLimit = grid[0].length - 1;
  let yLimit = grid.length - 1;

  let isValid = testCoordinates.x >= 0
            &&  testCoordinates.y >= 0
            &&  testCoordinates.x <= xLimit
            &&  testCoordinates.y <= yLimit;

  return isValid;
}

let isMatch = (grid, direction, startCoordinates) => {
  const XMAS = "MAS"; //x was already found, need to see if we can get a MAS
  let isMatch = true;

  let currentCoordinates = {
    x : startCoordinates.x,
    y : startCoordinates.y
  }

  for(let i = 0; i < XMAS.length; i++){
    currentCoordinates.x += direction.x
    currentCoordinates.y += direction.y

    let coordLogString = `[${currentCoordinates.x},${currentCoordinates.y}]`;

    log(`====> using ${coordLogString}`);

    if (!isValidCoordinates(grid, currentCoordinates)) {
      log("NOT VALID COORDS\n");
      isMatch = false;
      break;
    }

    let cToCheck = XMAS[i];
    let foundC = grid[currentCoordinates.x][currentCoordinates.y];
    let cTest = cToCheck === foundC
    log(`${cToCheck} === ${foundC}? | Result ${cTest ? "MATCHED" : "NOT MATCHED"}\n`);

    if (!cTest){
      isMatch = false;
      break;
    }
  }

  return isMatch;
}

fs.readFile(fn, "utf8", (err, data) => {
  if (err) {
    console.error ("Error reading the file:", err);
  }

  let grid = _convertToGrid(data);
  let searchPattern = searchMath();
  let total = 0;

  for (let sx = 0; sx < grid.length; sx++){
    let line = grid[sx];
    for(let sy = 0; sy < line.length; sy++){
      let c = line[sy];
      log(`using coords [${sx},${sy}]`);
      log(`${c} === X?`);
      if (c === "X"){
        log("MATCHED\n");
        searchPattern.forEach(sp => {
          log(`==> Using Direction [${sp.x},${sp.y}]\n`);
          if (isMatch(grid, sp, {x : sx, y : sy})){
            log("======> FOUND MATCH!!!\n");
            total++;
          }

        });
      } else {
        log("NOT MATCHED\n");
      }
    }
  }

  log(` >>> ANSWER: ${total} <<<\n\n`)
});

