// components/ColorRandomizer.tsx
import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface ColorRandomizerProps {
  onRandomize: () => void;
}

const ColorRandomizer = ({ onRandomize }: ColorRandomizerProps) => {
  return (
    <button
      onClick={onRandomize}
      className="group flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
    >
      <ArrowPathIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
      <span className="font-medium">Generate Random Palette</span>
    </button>
  );
};

export default ColorRandomizer;
