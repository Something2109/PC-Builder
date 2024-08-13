import { JSDOM } from "jsdom";
import * as fs from "fs";

async function fetchData() {
  const response = await fetch(
    `https://www.nvidia.com/en-us/geforce/graphics-cards/compare/?section=compare-specs`
  );
  const htmlText = await new Response(response.body).text();

  const document = new JSDOM(htmlText).window.document;
  const tables = document.getElementsByTagName("table");

  for (let i = 0; i < tables.length; i++) {
    const table = tables.item(i);
    fs.writeFileSync(
      `./data/${i}.json`,
      JSON.stringify(getDataFromTable(table))
    );
  }
}

function getDataFromTable(table: HTMLTableElement | null) {
  const result: {
    [key in string]: { [key in string]: string | null };
  } = {};

  if (table) {
    const col_num: number = table.rows[0].cells.length;
    let property_idx = 0;

    for (let i = 0; i < col_num; i++) {
      const header = table.rows[0].cells[i].textContent;
      if (header) {
        if (header.match(/^ +$/)) {
          property_idx = i;
        } else {
          result[header] = {};
          for (let j = 1; j < table.rows.length; j++) {
            const property = table.rows[j].cells[property_idx].textContent;
            const value = table.rows[j].cells[i];

            console.log(property, value);
            if (property && value) {
              result[header][property] = value.textContent;
            }
          }
        }
      }
    }
  }

  return result;
}

fetchData();
