const fs   = require("fs");
const data = "./data/day2-full.txt";

let isIncrementing = report => {
    process.stdout.write("Check Incrementing => ");
    let result = true;

    let lastValue = -1

    for(let a = 0; a < report.length; a++){
        let v = report[a];

        process.stdout.write(`${v} > ${lastValue} | `);
        
        if (v > lastValue) {
            lastValue = v;
        } else {
            result = false;
            break;
        }
    }

    result ? console.log("INCREMENTING") : console.log("NOT INCREMENTING");

    return result;
}

let isDecreasing = report => {
    process.stdout.write("Check Decreasing   => ");
    let result = true;

    let lastValue = Number.MAX_SAFE_INTEGER

    for(let a = 0; a < report.length; a++){
        let v = report[a];

        process.stdout.write(`${v} < ${lastValue} | `);
        
        if (v < lastValue) {
            lastValue = v;
        } else {
            result = false;
            break;
        }
    }

    result ? console.log("DECREASING") : console.log("NOT DECREASING");

    return result;
}

let isSafeDifference = report => {
    process.stdout.write("Check Difference   => ");
    let result = true;

    for(let a = 0; a < report.length - 1; a++){
        let i1 = report[a];
        let i2 = report[a + 1];
        let diff = Math.abs(i1 - i2);

        process.stdout.write(`${i1}-${i2}=${diff} | `)

        if (diff > 3){
            result = false;
            break;
        }
    }

    result ? console.log("SAFE DIFFERENCE") : console.log("UNSAFE DIFFERENCE");


    return result;
}

let isReportSafe = (report) => {
    let result = true;

    console.log(report);

    result = (isIncrementing(report) || isDecreasing(report)) && isSafeDifference(report);

    return result;
}

fs.readFile(data, "utf8", (err, data) => {
    if (err) {
        console.error ("Error reading the file:", err);
    }

    let safeCounter = 0;
    data.trim().split("\n").forEach(line => {
        let report = []
        
        line.split(" ").forEach(i => {
            report.push(parseInt(i, 10));
        });
        
        if (isReportSafe(report)){
            safeCounter++;
        }
    })

    console.log(safeCounter);

});

