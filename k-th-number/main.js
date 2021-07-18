#!/usr/bin/env node

let { KthFind } = require("./src/k-th-find");

/** @type {string[]} */
let args = process.argv.slice(2);

switch (args[0]) {
    case "find": {
        let Kth = Number.parseInt(args[1]);
        let input = args.slice(2).join(" ");
        let list = eval(input);
        if (list instanceof Array) {
            console.log(KthFind(list, Kth));
        }
        else {
            console.error("should inpuut a array initial expression");
        }
    } break;
    default:
        console.log(`
Usage: find 3 [5,7,2,1,4] // output 4
`)
}