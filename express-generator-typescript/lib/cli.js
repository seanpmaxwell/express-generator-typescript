#!/usr/bin/env node

/**
 * Create new express-generator-typescript project.
 *
 * created by Sean Maxwell, 5/31/2019
 */

const path = require("path");
const expressGenTs = require("../lib/express-generator-typescript");

(() => {
  // Get the name of the new project
  let destination;
  let withAuth = false;
  let useYarn = false;

  if (process.argv[2] === "--with-auth") {
    withAuth = true;

    useYarn = process.argv[3] === "--use-yarn" ? true : false;

    // case the user is using the use-yarn option the destination will be the 4 index
    let destIndexProcess = useYarn === true ? 4 : 3;

    destination = getDest(process.argv[destIndexProcess]);
  } else {
    useYarn = process.argv[2] === "--use-yarn" ? true : false;

    // case the user is using the use-yarn option the destination will be the 4 index
    let destIndexProcess = useYarn === true ? 3 : 2;

    destination = getDest(process.argv[destIndexProcess]);
  }

  // Creating new project started
  console.log("Setting up new Express/TypeScript project...");

  // Creating new project finished
  expressGenTs(destination, withAuth, useYarn).then(() => {
    console.log("Project setup complete!");
  });
})();

/**
 * Get the folder name of the new project
 *
 * @param destFolder
 */
function getDest(destFolder) {
  destFolder = destFolder || "express-gen-ts";
  return path.join(process.cwd(), destFolder);
}
