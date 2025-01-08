// utils/colorUtils.ts
import { ColorPalette, ColorRelationship } from "./types";

export class ColorUtils {
  // Convert hex to HSL
  static hexToHSL(hex: string): { h: number; s: number; l: number } {
    // Remove the # if present
    hex = hex.replace(/^#/, "");

    // Parse the hex values
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100,
    };
  }

  // Convert HSL to hex
  static HSLToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Calculate relative luminance for WCAG contrast
  static getLuminance(hex: string): number {
    const rgb = hex
      .replace(/^#/, "")
      .match(/.{2}/g)!
      .map((x) => parseInt(x, 16) / 255)
      .map((x) =>
        x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
      );

    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  }

  // Calculate contrast ratio
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Adjust color saturation and lightness based on website vibe
  static adjustColorForVibe(
    color: string,
    saturationRange: [number, number],
    lightnessBias: number
  ): string {
    const hsl = this.hexToHSL(color);
    const newSaturation = Math.min(
      Math.max(hsl.s, saturationRange[0]),
      saturationRange[1]
    );
    const newLightness = Math.min(Math.max(hsl.l + lightnessBias, 0), 100);

    return this.HSLToHex(hsl.h, newSaturation, newLightness);
  }

  // Generate an array of shades for a given color
  static generateShades(color: string, count: number = 9): string[] {
    const hsl = this.hexToHSL(color);
    return Array.from({ length: count }, (_, i) => {
      const lightness = (100 / (count - 1)) * i;
      return this.HSLToHex(hsl.h, hsl.s, lightness);
    });
  }

  // Generate tints (lighter versions) of a color
  static generateTints(color: string, count: number = 5): string[] {
    const hsl = this.hexToHSL(color);
    return Array.from({ length: count }, (_, i) => {
      const lightness = hsl.l + ((100 - hsl.l) / count) * (i + 1);
      return this.HSLToHex(hsl.h, hsl.s, lightness);
    });
  }

  // Generate shades (darker versions) of a color
  static generateTones(color: string, count: number = 5): string[] {
    const hsl = this.hexToHSL(color);
    return Array.from({ length: count }, (_, i) => {
      const saturation = hsl.s - (hsl.s / count) * (i + 1);
      return this.HSLToHex(hsl.h, saturation, hsl.l);
    });
  }
}

export class ColorGenerator {
  private static calculateContrast(color1: string, color2: string): number {
    return ColorUtils.getContrastRatio(color1, color2);
  }

  private static adjustForAccessibility(
    foreground: string,
    background: string,
    minContrast: number = 4.5
  ): string {
    const hsl = ColorUtils.hexToHSL(foreground);
    let attempts = 0;

    while (
      ColorUtils.getContrastRatio(foreground, background) < minContrast &&
      attempts < 100
    ) {
      if (hsl.l > 50) {
        hsl.l = Math.max(0, hsl.l - 5);
      } else {
        hsl.l = Math.min(100, hsl.l + 5);
      }
      foreground = ColorUtils.HSLToHex(hsl.h, hsl.s, hsl.l);
      attempts++;
    }

    return foreground;
  }

  private static generateHarmony(
    baseColor: string,
    type: ColorRelationship["harmony"]
  ): string[] {
    const hsl = ColorUtils.hexToHSL(baseColor);
    const colors: string[] = [baseColor];

    switch (type) {
      case "analogous":
        colors.push(
          ColorUtils.HSLToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
          ColorUtils.HSLToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
        );
        break;
      case "complementary":
        colors.push(ColorUtils.HSLToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        break;
      case "triadic":
        colors.push(
          ColorUtils.HSLToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          ColorUtils.HSLToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
        );
        break;
      case "tetradic":
        colors.push(
          ColorUtils.HSLToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
          ColorUtils.HSLToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          ColorUtils.HSLToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
        );
        break;
    }

    return colors;
  }

  static generatePalette(
    baseColor: string,
    preferences: {
      harmony: ColorRelationship["harmony"];
      intensity: "light" | "medium" | "dark";
      minContrast: number;
      vibe?: {
        saturationRange: [number, number];
        lightnessBias: number;
      };
    }
  ): ColorPalette {
    // Adjust base color for vibe if specified
    const adjustedBaseColor = preferences.vibe
      ? ColorUtils.adjustColorForVibe(
          baseColor,
          preferences.vibe.saturationRange,
          preferences.vibe.lightnessBias
        )
      : baseColor;

    const harmonicColors = this.generateHarmony(
      adjustedBaseColor,
      preferences.harmony
    );
    const hsl = ColorUtils.hexToHSL(adjustedBaseColor);

    // Adjust lightness based on intensity
    const intensityMap = {
      light: { base: 80, range: 15 },
      medium: { base: 60, range: 20 },
      dark: { base: 40, range: 25 },
    };

    const { base, range } = intensityMap[preferences.intensity];

    const palette: ColorPalette = {
      primary: adjustedBaseColor,
      secondary:
        harmonicColors[1] ||
        ColorUtils.HSLToHex(hsl.h, hsl.s * 0.8, base - range),
      accent:
        harmonicColors[2] ||
        ColorUtils.HSLToHex(hsl.h, hsl.s * 1.2, base + range),
      background: ColorUtils.HSLToHex(
        hsl.h,
        hsl.s * 0.1,
        preferences.intensity === "dark" ? 10 : 95
      ),
      text: ColorUtils.HSLToHex(
        hsl.h,
        hsl.s * 0.1,
        preferences.intensity === "dark" ? 90 : 10
      ),
      success: ColorUtils.HSLToHex(120, 60, 45), // Green
      warning: ColorUtils.HSLToHex(45, 100, 50), // Orange
      error: ColorUtils.HSLToHex(0, 80, 50), // Red
    };

    // Ensure text contrast
    palette.text = this.adjustForAccessibility(
      palette.text,
      palette.background,
      preferences.minContrast
    );

    return palette;
  }

  // Generate a full color scheme including shades
  static generateFullScheme(
    baseColor: string,
    preferences: Parameters<typeof ColorGenerator.generatePalette>[1]
  ) {
    const palette = this.generatePalette(baseColor, preferences);
    const shades = ColorUtils.generateShades(baseColor);
    const tints = ColorUtils.generateTints(baseColor);
    const tones = ColorUtils.generateTones(baseColor);

    return {
      palette,
      shades,
      tints,
      tones,
    };
  }
}
