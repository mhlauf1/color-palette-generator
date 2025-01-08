import React from "react";
import { WebsiteVibe } from "@/utils/types";

interface InputHandlerProps {
  colorInput: string;
  handleColorInputChange: any;
  handleHexInputChange: any;
  preferences: any;
  setPreferences: any;
  WEBSITE_VIBES: WebsiteVibe[];
}

const InputHandler = ({
  colorInput,
  handleColorInputChange,
  handleHexInputChange,
  preferences,
  setPreferences,
  WEBSITE_VIBES,
}: InputHandlerProps) => {
  return (
    <div className="px-6 h-full flex flex-col gap-10 pt-16 pb-4 border-r border-neutral-200">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">1. Choose Your Base Color</h2>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={colorInput}
            onChange={handleColorInputChange}
            className="h-16 w-16 border rounded cursor-pointer"
          />
          <input
            type="text"
            value={colorInput}
            onChange={handleHexInputChange}
            className="px-3 py-2 border rounded"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">2. Select Harmony</h2>
        <select
          value={preferences.harmony}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              harmony: e.target.value as typeof preferences.harmony,
            })
          }
          className="w-full p-2 border rounded bg-white"
        >
          <option value="analogous">Analogous - Similar Colors</option>
          <option value="complementary">Complementary - Opposite Colors</option>
          <option value="triadic">Triadic - Three Point Balance</option>
          <option value="tetradic">Tetradic - Four Color Harmony</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">3. Choose Intensity</h2>
        <div className="grid grid-cols-3 gap-2">
          {["light", "medium", "dark"].map((intensity) => (
            <button
              key={intensity}
              onClick={() =>
                setPreferences({
                  ...preferences,
                  intensity: intensity as typeof preferences.intensity,
                })
              }
              className={`px-4 py-2 rounded-lg border transition-all ${
                preferences.intensity === intensity
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">4. Select Website Vibe</h2>
        <div className="grid grid-cols-2 gap-2">
          {WEBSITE_VIBES.map((vibe) => (
            <button
              key={vibe.name}
              onClick={() =>
                setPreferences({
                  ...preferences,
                  vibe,
                })
              }
              className={`p-3 rounded-lg border text-left transition-all ${
                preferences.vibe.name === vibe.name
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{vibe.name}</div>
              <div className="text-sm opacity-75">{vibe.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputHandler;
