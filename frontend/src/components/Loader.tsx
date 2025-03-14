"use client";

import { FC } from "react";

const Loader: FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;