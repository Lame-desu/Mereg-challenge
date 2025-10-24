# 📊 Department Sales Aggregator

A high-performance backend and frontend system for processing **large CSV files** of departmental sales data using **streaming**, **Node.js (TypeScript + Express)**, and a **Next.js + Tailwind** frontend.

---

## 🚀 Features

- Upload large CSV files via a web UI  
- Backend aggregates total sales per department efficiently using streams (memory-safe)  
- Returns a downloadable processed result CSV  
- Real-time progress feedback (frontend ready)  
- Modular, typed, and well-tested backend  
- Built for scalability and large data handling  

---

## 🏗️ Project Structure


---

## ⚙️ Backend Setup

### 1️⃣ Install dependencies
```bash
cd backend
npm install
```

2️⃣ Run the server
```bash
npm run dev
```
Server runs on http://localhost:3001.

🧪 Backend Testing
Run tests
```bash
npm test
```

Expected output
 PASS  tests/upload.test.ts
  POST /upload
    ✓ should process a CSV file and return download link (52 ms)


✅ Tests cover:
/upload endpoint end-to-end
File upload and streaming aggregation
CSV result creation and cleanup

🧮 Algorithm Explanation
The backend uses Node.js streaming to process CSV files without loading them fully into memory.

Steps:
Receive the CSV file through an HTTP POST (/upload) endpoint.
Stream the file line by line using csv-parser.
Maintain an in-memory aggregation map:
totals[departmentName] += numberOfSales;
After the stream ends, write the aggregated totals to a new CSV using fs.createWriteStream().
Respond with a downloadable link to the generated file.

Example:

Input
New York,2024-01-01,100
Boston,2024-01-01,50
New York,2024-01-01,30

Output
New York,130
Boston,50

🧠 Memory Efficiency Strategy
The system never loads the full CSV file into memory.
Using streaming (csv-parser + fs streams), each row is processed immediately and discarded.
The only in-memory structure is a simple Record<string, number> map of departments and totals.
This allows processing of files with millions of rows using minimal RAM.

⏱️ Time & Space Complexity
Operation	Complexity	Explanation
Reading all rows	O(N)	Each row is read exactly once
Updating aggregation map	O(1) per row	Constant-time map update
Writing result CSV	O(D)	D = number of unique departments
Total Time	O(N)	
Memory	O(D) — only unique department names are stored	

💻 Frontend Setup (Next.js + Tailwind)
1️⃣ Install dependencies
```bash
cd frontend
npm install
```

2️⃣ Run the app
```bash
npm run dev
```
The frontend runs on http://localhost:3000.
Make sure your backend is also running (http://localhost:3001).

🌐 Frontend Features
Built with Next.js App Router
Styled using Tailwind CSS
Simple drag-and-drop or file upload UI
Shows a progress bar
Displays a download link once processing is complete

🧩 Example Testing File

You can test with the following CSV (test-sales.csv):

New York,2024-01-01,100
Boston,2024-01-01,50
New York,2024-01-01,30
Chicago,2024-01-02,70
Boston,2024-01-02,120
Los Angeles,2024-01-03,200
New York,2024-01-04,90
Chicago,2024-01-04,60
Los Angeles,2024-01-05,150
Boston,2024-01-06,80
Houston,2024-01-06,100
Houston,2024-01-07,50
New York,2024-01-08,130
Los Angeles,2024-01-09,70
Chicago,2024-01-09,40
Boston,2024-01-10,100
Houston,2024-01-11,120
Chicago,2024-01-11,30
New York,2024-01-12,60
Los Angeles,2024-01-12,90


Expected Output:

New York,410
Boston,350
Chicago,200
Los Angeles,510
Houston,270

🧰 Technologies Used
Backend
Node.js + Express
TypeScript
csv-parser, multer
fs streams
Jest + Supertest for tests

Frontend
Next.js (App Router)
React
Tailwind CSS

🧾 Notes for Reviewers / Interviewers
✅ Fully functional backend & frontend
✅ Streaming ensures scalability
✅ Typed, modular, and testable code
✅ Professional documentation and testing

Author: Lamesgin Desalegn
Date: October 24 2025
Project: CSV Department Sales Aggregator – Interview Challenge
