import React from "react";

interface Props {
  progress: number;
}

const ProgressBar: React.FC<Props> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mt-6 overflow-hidden">
      <div
        className="bg-green-500 h-4 text-xs text-center text-white transition-all duration-300"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
