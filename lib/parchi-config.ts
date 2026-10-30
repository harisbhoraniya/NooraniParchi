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
  day: { x1: 258, x2: 618, y: 514, size: 60, lift: 16 },
  date: { x1: 1250, x2: 1710, y: 515, size: 60, lift: 16 },
  mukam: { x1: 360, x2: 1725, y: 670, size: 76, lift: 20 },
  talim: { x1: 292, x2: 1728, y: 825, size: 76, lift: 20 },
  sifat: { x1: 335, x2: 1652, y: 980, size: 76, lift: 20 },
  istekbal: { x1: 365, x2: 1684, y: 1134, size: 76, lift: 20 },
};

export const REQUIRED_FIELDS: string[] = [];

// Font families for canvas drawing
export const FONT_NASTALIQ = "Noto Nastaliq Urdu";
export const FONT_MANROPE = "Manrope";
export const FONT_SANS = "Manrope";
export const FONT_DEVANAGARI = "Noto Sans Devanagari";

