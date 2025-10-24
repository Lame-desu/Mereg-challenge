import React, { useState } from "react";
import axios from "axios";

interface Props {
  onProgress: (p: number) => void;
  onProcessing: (v: boolean) => void;
  onCompleted: (url: string | null) => void;
}

const FileUploader: React.FC<Props> = ({
  onProgress,
  onProcessing,
  onCompleted,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file first.");

    const formData = new FormData();
    formData.append("file", file);

    onProcessing(true);
    onCompleted(null);
    onProgress(0);

    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        },
      });

      onProgress(100);
      onCompleted(res.data.downloadUrl);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check backend server.");
    } finally {
      onProcessing(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-4"
      />
      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
      >
        Upload & Process
      </button>
    </div>
  );
};

export default FileUploader;
