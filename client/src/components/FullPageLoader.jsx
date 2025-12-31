import React from "react";

const FullPageLoader = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white gap-4">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Custom Text */}
      <p className="text-indigo-600 text-lg font-medium animate-pulse">
        Just a moment...
      </p>
    </div>
  );
};

export default FullPageLoader;
