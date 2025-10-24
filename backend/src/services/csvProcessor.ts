import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { v4 as uuidv4 } from "uuid";

const resultsDir = path.join(__dirname, "..", "..", "results");
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

/**
 * Process a CSV file at `inputPath` using streaming. Assumes CSV has no header and columns are:
 * Department Name, Date (YYYY-MM-DD), Number of Sales
 *
 * Writes an output CSV named <uuid>.csv into results/ with two columns: department,total
 */
export async function processCsvFile(inputPath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const totals = new Map<string, number>();

    // If the CSV doesn't have a header, we supply headers so csv-parser maps columns correctly.
    const parser = csvParser({
      headers: ["department", "date", "sales"],
      skipLines: 0,
      mapValues: ({ header, index, value }) => value,
    });

    const readStream = fs.createReadStream(inputPath);

    readStream
      .pipe(parser)
      .on("data", (row: any) => {
        try {
          const department = (row.department ?? "").toString().trim();
          const salesStr = (row.sales ?? "").toString().trim();
          const sales = parseInt(salesStr, 10);

          if (!department) return; // skip blank
          if (Number.isNaN(sales)) return; // skip malformed

          const prev = totals.get(department) ?? 0;
          totals.set(department, prev + sales);
        } catch (err) {
          // malformed row — skip but don't crash
          console.warn("Skipping malformed row", err);
        }
      })
      .on("end", () => {
        // write results to CSV file
        const outId = uuidv4();
        const outPath = path.join(resultsDir, `${outId}.csv`);
        const writeStream = fs.createWriteStream(outPath, { encoding: "utf8" });

        // Write header optional (sample shows none); we'll write without header to match sample
        // writeStream.write('Department Name,Total Number of Sales\n');

        for (const [department, total] of totals.entries()) {
          writeStream.write(`${escapeCsv(department)},${total}\n`);
        }

        writeStream.end(() => resolve(`${outId}.csv`));
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function escapeCsv(value: string) {
  // very small CSV escape — add quotes if contains comma or quote or newline
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
