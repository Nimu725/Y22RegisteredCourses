const XLSX = require("xlsx");
const fs = require("fs");

// -------- Registered Courses --------
const coursesWorkbook = XLSX.readFile("public/Y22 -SRC SEM WISE UPTO 4-2.xlsx");
const coursesSheet = coursesWorkbook.Sheets[coursesWorkbook.SheetNames[0]];
const coursesData = XLSX.utils.sheet_to_json(coursesSheet);

fs.writeFileSync(
  "public/registeredcourses.json",
  JSON.stringify(coursesData, null, 2)
);

console.log("registeredcourses.json created");


// -------- Course Credits --------
const creditsWorkbook = XLSX.readFile("public/y22-courses-credits.xlsx");
const creditsSheet = creditsWorkbook.Sheets[creditsWorkbook.SheetNames[0]];
const creditsData = XLSX.utils.sheet_to_json(creditsSheet);

fs.writeFileSync(
  "public/y22-courses-credits.json",
  JSON.stringify(creditsData, null, 2)
);

console.log("y22-courses-credits.json created");