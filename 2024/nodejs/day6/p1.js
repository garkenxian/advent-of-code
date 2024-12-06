const fs = require("fs"),
      fn = `${__dirname}/data/test.txt`,
      directions = "^>v<",
      movements = {
        "^": {
            x : 0,
            y : -1
        },
        ">":{
            x : 1,
            y : 0
        },
        "v":{
            x : 0,
            y : 1
        },
        "<":{
            x : -1,
            y : 0
        }
      };

let map = [];

let getInitialLocationAndDirection = () => {
    let xLimit = map[0].length;
    let yLimit = map.length;
    
    let position = null;
    for(let x = 0; x < xLimit; x++){
        for (let y = 0; y < yLimit; y++){
            let c = map[y][x];

            if (directions.indexOf(c) >= 0){
                console.log(`Found Guard, at location [${x},${y}] facing ${c}`);
                position = {
                    x        : x,
                    y        : y,
                    direction: c,
                    isOnMap  : true
                };
                break;
            }
        }
        if (position !== null){
            break;
        }
    }

    return position;
}

let isInMap = (x, y) => {
    let xLimit = map[0].length - 1,
        yLimit = map.length - 1;

    //console.log(`Checking coordinates [${x}, ${y}] against [0,0] -> [${xLimit}, ${yLimit}]`);
    return (x >= 0) && (x <= xLimit) && (y >= 0) && (y <= yLimit);
}

let getNextDirection = currentDirection => {
    let newIndex = directions.indexOf(currentDirection) + 1;

    if (newIndex >= directions.length){
        newIndex = 0;
    }

    return directions[newIndex];
}

let makeNextMove = (x, y, direction) => {
    let moveDir = movements[direction];
    let nextX = x + moveDir.x;
    let nextY = y + moveDir.y;
    let nextDir = direction;
    let nextPos = null;

    if (!isInMap(nextX, nextY)){
        console.log("Next Position is NOT ON THE MAP");
    } else {
        nextPos = map[nextY][nextX];
    }

    switch (nextPos){
        case ".":
        case "^":
        case ">":
        case "v":
        case "<":
            // safe to move, update map with new location
            map[y][x] = direction;
            map[nextY][nextX] = direction;
            break;
        case "#":
            // not safe to move turn 90 degrees and update map with new direction
            nextX = x;
            nextY = y;
            nextDir = getNextDirection(direction);
            break;
        case null:
            // off the map, update map with X and set return value to false;
            map[y][x] = direction;
            nextDir = null;
            break;
    }

    return {
        x        : nextX,
        y        : nextY,
        direction: nextDir,
        isOnMap  : nextPos !== null
    };
}

fs.readFile(fn, "utf-8", (err, data) => {
    if (err) {
      console.error ("Error reading the file:", err);
    }

    data.split("\n").forEach(line => {
        let lArray = [];
        line.trim().split("").forEach(c => {
            lArray.push(c);
        });
        map.push(lArray);
    });

    let currentPosition = getInitialLocationAndDirection();

    console.log(currentPosition);

    while(currentPosition.isOnMap){
        currentPosition =  makeNextMove(currentPosition.x, currentPosition.y, currentPosition.direction);
    }  

    // get the number of X's in the map now
    let counter = 0;
    map.forEach(line => {
        counter += line.filter(c => directions.indexOf(c) > -1).length;
    });

    console.log(counter);
});

