"use client";

import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
import ProgressBar from "../components/ProgressBar";
import { FaFileCsv } from "react-icons/fa";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4 flex justify-center items-center gap-2">
          <FaFileCsv className="text-green-600" /> CSV Sales Aggregator
        </h1>
        <p className="text-gray-500 mb-6">
          Upload a large CSV file and aggregate departmental sales.
        </p>

        <FileUploader
          onProgress={setProgress}
          onProcessing={setIsProcessing}
          onCompleted={setDownloadUrl}
        />

        {isProcessing && <ProgressBar progress={progress} />}

        {downloadUrl && (
          <div className="mt-6">
            <h3 className="text-green-600 font-semibold mb-2">
              Processing Complete ✅
            </h3>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Download Result CSV
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
