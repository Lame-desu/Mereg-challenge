import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../src/app"; // your Express app (exported from app.ts)

// Clean up output files after test
afterAll(() => {
  const resultsDir = path.join(__dirname, "../results");
  if (fs.existsSync(resultsDir)) {
    fs.readdirSync(resultsDir).forEach((file) =>
      fs.unlinkSync(path.join(resultsDir, file))
    );
  }
});

describe("POST /upload", () => {
  it("should process a CSV file and return download link", async () => {
    const testFilePath = path.join(__dirname, "sample.csv");

    // create a small sample CSV file
    fs.writeFileSync(
      testFilePath,
      "New York,2024-01-01,100\nBoston,2024-01-01,50\nNew York,2024-01-02,30"
    );

    const response = await request(app)
      .post("/upload")
      .attach("file", testFilePath);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("downloadUrl");
    expect(response.body.downloadUrl).toMatch(/\.csv$/);

    // check if result CSV file exists
    const outputPath = path.join(
      __dirname,
      "../results",
      path.basename(response.body.downloadUrl)
    );
    const fileExists = fs.existsSync(outputPath);
    expect(fileExists).toBe(true);

    // clean up temp CSV
    fs.unlinkSync(testFilePath);
  });
});

afterAll(async () => {
  // delete results folder files
  const resultsDir = path.join(__dirname, "../results");
  if (fs.existsSync(resultsDir)) {
    for (const file of fs.readdirSync(resultsDir)) {
      fs.unlinkSync(path.join(resultsDir, file));
    }
  }

  // small delay to let async streams fully close
  await new Promise((res) => setTimeout(res, 200));
});
