import React, { useState } from "react";
import { ColorUtils } from "@/utils/colorUtils";
import { ColorPalette } from "@/utils/types";
import ColorRandomizer from "./ColorRandomizer";

interface ColorResultsProps {
  palette: ColorPalette | null;
  shades: string[];
  handleRandomize: () => void;
}

const ColorResults = ({
  palette,
  shades,
  handleRandomize,
}: ColorResultsProps) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1000); // Reset after 1 second
  };

  return (
    <div className="px-6  flex flex-col items-end gap-10 pt-16 pb-4">
      <ColorRandomizer onRandomize={handleRandomize} />
      {palette && (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Main Palette</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(palette).map(([name, color]) => (
              <div
                key={name}
                onClick={() => handleCopyColor(color as string)}
                className="p-8 rounded-md relative group cursor-pointer transition-all hover:shadow-lg"
                style={{
                  backgroundColor: color,
                  color:
                    ColorUtils.getContrastRatio(color as string, "#ffffff") >
                    4.5
                      ? "#ffffff"
                      : "#000000",
                }}
              >
                <p className="font-medium capitalize">{name}</p>
                <p className="text-sm opacity-75">{color}</p>
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50 text-white text-sm font-medium transition-opacity ${
                    copiedColor === color
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {copiedColor === color ? "Copied!" : "Click to copy"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4">Color Shades</h2>
        <div className="grid grid-cols-9 gap-1 h-28">
          {shades.map((shade, index) => (
            <div
              key={index}
              onClick={() => handleCopyColor(shade)}
              className="relative group border border-neutral-100 rounded-md cursor-pointer"
              style={{ backgroundColor: shade }}
            >
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-md hover:border-neutral-50 text-white text-xs transition-opacity ${
                  copiedColor === shade
                    ? "bg-black bg-opacity-50 opacity-100"
                    : "bg-black bg-opacity-50 opacity-0 group-hover:opacity-100"
                }`}
              >
                {copiedColor === shade ? (
                  "Copied!"
                ) : (
                  <div className="text-center">
                    <div>{shade}</div>
                    <div className="text-xs opacity-75">Click to copy</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorResults;
