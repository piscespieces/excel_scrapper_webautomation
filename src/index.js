const fs = require("fs");
const xlsx = require("xlsx");
// const data = require("./json/raw_data.json");

let wb = xlsx.readFile("GEN_Starters_Master_List_4-08-2020.xlsx");

let ws = wb.Sheets["Updated MasterList"];

let data = ws;

// let data_to_json = JSON.stringify(ws, null, 2);
// fs.writeFileSync("json/raw_data.json", data_to_json, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("File has been written");
//   }
// });

const filterRowCells = Object.keys(data).filter((cell) => {
  if (
    cell.indexOf("A") > -1 ||
    cell.indexOf("B") > -1 ||
    cell.indexOf("C") > -1 ||
    cell.indexOf("D") > -1
  ) {
    return cell;
  }
});

let startCell = filterRowCells.indexOf("A5");
let endCell = filterRowCells.indexOf("D171");

const filterColCells = filterRowCells.slice(startCell, endCell + 1);
const filteredCellResultArray = filterColCells;

const filtered = Object.keys(data)
  .filter((key) => filteredCellResultArray.includes(key))
  .reduce((obj, key) => {
    return {
      ...obj,
      [key]: data[key],
    };
  }, {});

let object = {};
let groupedArray = Object.keys(filtered).reduce((p, k) => {
  if (k[0] !== "A") {
    if (k[0] === "B") {
      object["lastName"] = filtered[k];
    } else if (k[0] === "C") {
      object["company"] = filtered[k];
    } else if (k[0] === "D") {
      object["email"] = filtered[k];
    }
  } else {
    object = { firstName: filtered[k] };
    p.push(object);
  }

  return p;
}, []);

module.exports = groupedArray;
