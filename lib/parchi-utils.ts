// Date and drawing utility helpers for the Noorani Masjid Parchi

import {
  FIELDS,
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  SCALE,
  INK_COLOR,
  FONT_NASTALIQ,
  FONT_DEVANAGARI,
  type FieldConfig,
} from "./parchi-config";

// ─── Date helpers ────────────────────────────────────────────────────────────

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Current weekday name in English */
export function getCurrentDay(): string {
  return WEEKDAYS[new Date().getDay()];
}

/** Today formatted as DD/MM/YYYY */
export function getCurrentDate(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Capitalize the first letter of each word (Title Case) */
export function capitalizeWords(str: string): string {
  if (!str) return "";
  return str.replace(/(^|[\s\-_./])\p{L}/gu, (match) => match.toUpperCase());
}

// ─── RTL detection ───────────────────────────────────────────────────────────

const RTL_RE = /[\u0590-\u08FF\uFB50-\uFEFF]/;

export function isRTL(text: string): boolean {
  return RTL_RE.test(text);
}

// ─── Font loading ────────────────────────────────────────────────────────────

let manropeFontPromise: Promise<void> | null = null;

/** Explicitly load and register local Manrope font into document.fonts for canvas */
export async function loadManropeFont(): Promise<void> {
  if (typeof window === "undefined" || typeof FontFace === "undefined") return;
  if (!manropeFontPromise) {
    manropeFontPromise = (async () => {
      try {
        const font = new FontFace("Manrope", "url(/fonts/Manrope-Variable.ttf)", {
          weight: "200 800",
          style: "normal",
        });
        const loaded = await font.load();
        document.fonts.add(loaded);
        await document.fonts.ready;
      } catch (err) {
        console.error("Error loading Manrope font:", err);
      }
    })();
  }
  return manropeFontPromise;
}

/** Ensure all fonts used for the given values are loaded before drawing */
export async function ensureFontsLoaded(
  values: Record<string, string>
): Promise<void> {
  if (typeof document === "undefined") return;

  // Ensure local Manrope font is registered in canvas font context
  await loadManropeFont();

  if (!document.fonts?.load) return;

  const promises: Promise<unknown>[] = [];
  for (const [, text] of Object.entries(values)) {
    if (!text.trim()) continue;
    if (isRTL(text)) {
      promises.push(
        document.fonts.load(`52px "${FONT_NASTALIQ}"`, text)
      );
    } else {
      promises.push(
        document.fonts.load(`700 52px "Manrope"`, text)
      );
      promises.push(
        document.fonts.load(`600 52px "${FONT_DEVANAGARI}"`, text)
      );
    }
  }
  await Promise.all(promises);
}

// ─── Canvas drawing ──────────────────────────────────────────────────────────

/**
 * Draw the parchi: background image + all text overlays.
 * The canvas must already be sized to CANVAS_WIDTH × CANVAS_HEIGHT.
 */
export function drawParchi(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  values: Record<string, string>
): void {
  // Reset transform and clear
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Set scale so all coordinates are in original image pixels
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);

  // Draw the background image
  ctx.drawImage(img, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

  // Draw each field
  for (const [key, config] of Object.entries(FIELDS)) {
    const rawText = (values[key] ?? "").trim();
    if (!rawText) continue;
    const text = key !== "date" ? capitalizeWords(rawText) : rawText;
    drawField(ctx, text, config);
  }
}

function drawField(
  ctx: CanvasRenderingContext2D,
  text: string,
  config: FieldConfig
): void {
  const { x1, x2, y, size, lift } = config;
  const maxWidth = x2 - x1;
  const baseline = y - lift;
  const rtl = isRTL(text);

  // Pick font
  let fontFamily: string;
  let fontWeight: string;
  let sizeMultiplier: number;

  if (rtl) {
    fontFamily = `"${FONT_NASTALIQ}"`;
    fontWeight = "";
    sizeMultiplier = 0.9;
  } else {
    fontFamily = `"Manrope", "${FONT_DEVANAGARI}", sans-serif`;
    fontWeight = "700 ";
    sizeMultiplier = 1;
  }

  // Shrink font until text fits
  let fontSize = Math.round(size * sizeMultiplier);
  const minSize = 16;
  ctx.fillStyle = INK_COLOR;

  while (fontSize >= minSize) {
    ctx.font = `${fontWeight}${fontSize}px ${fontFamily}`;
    const measured = ctx.measureText(text);
    if (measured.width <= maxWidth) break;
    fontSize -= 1;
  }

  // Final font set
  ctx.font = `${fontWeight}${fontSize}px ${fontFamily}`;

  if (rtl) {
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    ctx.fillText(text, x2, baseline);
  } else {
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.fillText(text, x1, baseline);
  }

  // Reset direction
  ctx.direction = "ltr";
  ctx.textAlign = "left";
}

// ─── Export helpers ──────────────────────────────────────────────────────────

/** Generate a PNG blob from the canvas */
export function canvasToBlob(
  canvas: HTMLCanvasElement
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

/** Generate the filename with today's date */
export function getExportFilename(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `noorani-masjid-parchi-${yyyy}-${mm}-${dd}.png`;
}

/** Trigger a file download */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

