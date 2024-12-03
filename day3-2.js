const fs   = require("fs");
const data = "./data/day3-full.txt";

let findMuls = data => {
    let newData = "";

    data.split("do()").forEach(ds => {
        newData += ds.split("don't()")[0];
    });

    let matchRegExp = /mul\(\d*,\d*\)/g
    let muls        = newData.match(matchRegExp);
    return muls;
}

let processMul = mul => {
    // mul(1,2) = 1*2
    let mulSplit = mul.split(",")
    let left     = parseInt(mulSplit[0].substring(4),10);
    let right    = parseInt(mulSplit[1].substring(0, mulSplit[1].length - 1));
    let total    = left * right

    console.log(`${mul} => ${left} * ${right} = ${total}`);

    return total;
}

fs.readFile(data, "utf8", (err, data) => {
    if (err) {
        console.error ("Error reading the file:", err);
    }

    let total = 0;

    findMuls(data).forEach(mul => {
        total += processMul(mul);

    });

    console.log(total);

});

