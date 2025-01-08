"use client";
import React, { useState, useEffect } from "react";
import { ColorGenerator, ColorUtils } from "@/utils/colorUtils";
import { ColorPalette, WebsiteVibe } from "@/utils/types";
import InputHandler from "./InputHandler";
import ColorResults from "./ColorResults";

const WEBSITE_VIBES: WebsiteVibe[] = [
  {
    name: "Minimal",
    description: "Clean, subtle, and sophisticated",
    saturationRange: [10, 30],
    lightnessBias: 10,
  },
  {
    name: "Professional",
    description: "Balanced and trustworthy",
    saturationRange: [30, 50],
    lightnessBias: 0,
  },
  {
    name: "Bold",
    description: "Strong and confident",
    saturationRange: [60, 80],
    lightnessBias: -5,
  },
  {
    name: "Energetic",
    description: "Vibrant and dynamic",
    saturationRange: [70, 90],
    lightnessBias: 5,
  },
];

const SHADES_COUNT = 9;

const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState("#EB652B");
  const [colorInput, setColorInput] = useState("#EB652B");
  const [preferences, setPreferences] = useState({
    harmony: "analogous" as const,
    intensity: "light" as const,
    minContrast: 4.5,
    vibe: WEBSITE_VIBES[0],
  });
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [shades, setShades] = useState<string[]>([]);

  const generateShades = (color: string) => {
    const hsl = ColorUtils.hexToHSL(color);
    const newShades = Array.from({ length: SHADES_COUNT }, (_, i) => {
      const lightness = (100 / (SHADES_COUNT - 1)) * i;
      return ColorUtils.HSLToHex(hsl.h, hsl.s, lightness);
    });
    setShades(newShades);
  };

  const generateNewPalette = () => {
    // Adjust saturation based on vibe
    const baseHSL = ColorUtils.hexToHSL(baseColor);
    const [minSat, maxSat] = preferences.vibe.saturationRange;
    const adjustedBaseColor = ColorUtils.HSLToHex(
      baseHSL.h,
      Math.min(Math.max(baseHSL.s, minSat), maxSat),
      Math.min(Math.max(baseHSL.l + preferences.vibe.lightnessBias, 0), 100)
    );

    const newPalette = ColorGenerator.generatePalette(
      adjustedBaseColor,
      preferences
    );
    setPalette(newPalette);
    generateShades(adjustedBaseColor);
  };

  useEffect(() => {
    generateNewPalette();
  }, [baseColor, preferences.harmony, preferences.intensity, preferences.vibe]);

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorInput(e.target.value);
    setBaseColor(e.target.value);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorInput(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setBaseColor(value);
    }
  };

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleRandomize = () => {
    // Generate random color
    const newColor = generateRandomColor();
    setBaseColor(newColor);
    setColorInput(newColor);

    // Random harmony
    const harmonies = ["analogous", "complementary", "triadic", "tetradic"];
    const randomHarmony = harmonies[
      Math.floor(Math.random() * harmonies.length)
    ] as typeof preferences.harmony;

    // Random intensity
    const intensities = ["light", "medium", "dark"];
    const randomIntensity = intensities[
      Math.floor(Math.random() * intensities.length)
    ] as typeof preferences.intensity;

    // Random vibe
    const randomVibe =
      WEBSITE_VIBES[Math.floor(Math.random() * WEBSITE_VIBES.length)];

    // Update all preferences at once
    setPreferences({
      ...preferences,
      harmony: randomHarmony,
      intensity: randomIntensity,
      vibe: randomVibe,
    });
  };

  return (
    <div className="flex flex-row  h-full w-screen">
      <div className="w-1/4">
        <InputHandler
          colorInput={colorInput}
          handleColorInputChange={handleColorInputChange}
          handleHexInputChange={handleHexInputChange}
          preferences={preferences}
          setPreferences={setPreferences}
          WEBSITE_VIBES={WEBSITE_VIBES}
        />
      </div>
      <div className="w-3/4 ">
        <ColorResults
          shades={shades}
          palette={palette}
          handleRandomize={handleRandomize}
        />
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;
