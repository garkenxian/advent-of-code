const fs = require("fs");
const fn = `${__dirname}/data/full.txt`;

let rules       = [],
    updates     = [];

let getMap = data => {
    let updateMap = line => {
        rules.push(line.trim());
    }

    let updateUpdate = line => {
        let arr = [];

        line.split(",").forEach(l => {
            arr.push(parseInt(l.trim(),10));
        });

        let obj = {
            update : arr,
            isValid : false
        }

        updates.push(obj);
    }

    let func = updateMap;
    data.split("\n").forEach(line => {
        //console.log(`Processing line ${line}`);

        if (line.trim() === ""){
            //console.log("Switching to updateUpdates function");
            func = updateUpdate;
        } else {
            func(line);
        }
    }); 
}

let updateComparison = (left, right) => {
    let validArray   = `${left}|${right}`,
        invalidArray = `${right}|${left}`;

    // is valid if the rules contain the valid array, or the rules does not contain the valid array, or neither

    // its valid just return true
    if (rules.indexOf(validArray) >= 0){
        return true;
    }

    // wait.. its specifically in the invalid list
    if (rules.indexOf(invalidArray) >= 0){
        return false;
    }

    // not in either
    return true;
}

let isUpdateValid = update => {
    let isValid = true;

    let u = [...update];
    let c = u.shift();

    for (let a = 0; a < u.length; a++){
        let ruleCheck = updateComparison(c, u[a]);
        if (!ruleCheck){
            isValid = false;
            break;
        }    
    }

    if (isValid === false || u.length === 1){
        return isValid;
    } else {
        return isUpdateValid(u);
    }
}

fs.readFile(fn, "utf-8", (err, data) => {
    if (err) {
      console.error ("Error reading the file:", err);
    }

    getMap(data);

    updates.forEach(u => {
        u.isValid = isUpdateValid(u.update);
    });

    let total = 0;
    updates.filter(u => u.isValid).forEach(u => {
        // get the middle value
        let mi = Math.floor(u.update.length / 2)
        total += u.update[mi];
    });

    console.log(total);

});