const fs = require("fs"),
      fn = `${__dirname}/data/full.txt`,
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

let guardStartPostion = null;

let processMoveMap = map => {
    let getInitialLocationAndDirection = () => {
        if (guardStartPostion !== null){
            return guardStartPostion;
        }

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
                        isOnMap  : true,
                        isLoop   : false
                    };
                    break;
                }
            }
            if (position !== null){
                break;
            }
        }
    
        guardStartPostion = position;
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
            //console.log("Next Position is NOT ON THE MAP");
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
            case "O":
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

    let currentPosition = getInitialLocationAndDirection();
    let moveDirectory = [];

    moveDirectory.push(`${currentPosition.x}|${currentPosition.y}|${currentPosition.direction}`);

    let isLoop = false;

    while(currentPosition.isOnMap && !isLoop){
        currentPosition =  makeNextMove(currentPosition.x, currentPosition.y, currentPosition.direction);

        let move = `${currentPosition.x}|${currentPosition.y}|${currentPosition.direction}`;
        isLoop = moveDirectory.indexOf(move) > -1;

        moveDirectory.push(`${currentPosition.x}|${currentPosition.y}|${currentPosition.direction}`);
    }
    return [map, isLoop];
}

let getPotentialObsticalLocations = map => {
    let xLimit = map[0].length;
    let yLimit = map.length;

    let obsticalMap = [];

    for (let x = 0; x < xLimit; x++){
        for (let y = 0; y < yLimit; y++){
            if (!(x === guardStartPostion.x && y === guardStartPostion.y)){
                let c = map[y][x]
                if ("^>v<".indexOf(c) > -1){
                    obsticalMap.push({
                        x : x,
                        y : y,
                        isLoop : null
                    });
                }
            } else {
                console.log(`Cannot put obstical at position [${x},${y}] because its the guard's start position`);
            }
        }
    }

    return obsticalMap;
}

let deepCopy = obj => {
    return JSON.parse(JSON.stringify(obj));
}


fs.readFile(fn, "utf-8", (err, data) => {
    if (err) {
      console.error ("Error reading the file:", err);
    }

    let map = []

    data.split("\n").forEach(line => {
        let lArray = [];
        line.trim().split("").forEach(c => {
            lArray.push(c);
        });
        map.push(lArray);
    });

    let [moveMap, isLoop] = processMoveMap(deepCopy(map));

    console.log(moveMap);
    // okay i have the initial move map
    // lets get the potential obstical locations

    let obsticalMap = getPotentialObsticalLocations(moveMap);

    let counter = 0;
    let cLimit = obsticalMap.length;
    obsticalMap.forEach(o => {
        counter++;
        console.log(`Processing Map ${counter} of ${cLimit}`);
        let testMap = deepCopy(map);
        testMap[o.y][o.x] = "O";

        let [updatedTestMap, isLoop] = processMoveMap(testMap);
        o.isLoop = isLoop;
    });
    
    let total = obsticalMap.filter(o => o.isLoop).length;
    console.log(total);
});

