#!/usr/bin/env node

let { encode, decode } = require("./src/convert");

/** @type {string[]} */
let args = process.argv.slice(2);

switch (args[0]) {
    case "encode":
        console.log(encode(eval(args[1])));
        break;
    case "decode":
        console.log(decode(args[1]));
        break;
    default:
        console.log(`
Usage: encode 1.56e-7
       decode 2DwfgnuGMe
`)
        break;
}