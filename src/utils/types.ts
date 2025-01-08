export interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success: string;
    warning: string;
    error: string;
}

export interface ColorRelationship {
    harmony: 'analogous' | 'complementary' | 'triadic' | 'tetradic';
    contrast: number; // WCAG contrast ratio
    intensity: 'light' | 'medium' | 'dark';
}

// utils/colorGeneration.ts
export class ColorGenerator {
    static generatePalette(): ColorPalette {
        // Main palette generation logic
        return {
            primary: '',
            secondary: '',
            accent: '',
            background: '',
            text: '',
            success: '',
            warning: '',
            error: ''
        }; // Placeholder
    }
}

export interface WebsiteVibe {
    name: string;
    description: string;
    saturationRange: [number, number];
    lightnessBias: number;
}

export interface Preferences {
    harmony: "analogous" | "complementary" | "triadic" | "tetradic";
    intensity: "light" | "medium" | "dark";
    minContrast: number;
    vibe: WebsiteVibe;
}