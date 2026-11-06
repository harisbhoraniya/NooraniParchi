// Overlay config for the Noorani Masjid Parchi
// Coordinates are in original image pixels (2000 x 1397)
// y = underline height, text baseline = y - lift

export const IMAGE_WIDTH = 2000;
export const IMAGE_HEIGHT = 1397;
export const SCALE = 1.5;
export const CANVAS_WIDTH = IMAGE_WIDTH * SCALE; // 3000
export const CANVAS_HEIGHT = IMAGE_HEIGHT * SCALE; // 2095.5

export const INK_COLOR = "#111";

export interface FieldConfig {
  x1: number;
  x2: number;
  y: number;
  size: number;
  lift: number;
}

export const FIELDS: Record<string, FieldConfig> = {
  day: { x1: 295, x2: 620, y: 523, size: 66, lift: 17 },
  date: { x1: 1285, x2: 1712, y: 521, size: 66, lift: 17 },
  mukam: { x1: 410, x2: 1728, y: 681, size: 70, lift: 19 },
  talim: { x1: 350, x2: 1728, y: 834, size: 70, lift: 19 },
  sifat: { x1: 390, x2: 1648, y: 996, size: 70, lift: 19 },
  istekbal: { x1: 425, x2: 1670, y: 1148, size: 70, lift: 19 },
};

export const REQUIRED_FIELDS: string[] = [];

// Font families for canvas drawing
export const FONT_NASTALIQ = "Noto Nastaliq Urdu";
export const FONT_MANROPE = "Manrope";
export const FONT_SANS = "Manrope";
export const FONT_DEVANAGARI = "Noto Sans Devanagari";

