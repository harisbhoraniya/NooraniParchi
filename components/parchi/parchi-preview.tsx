"use client";

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT, IMAGE_WIDTH, IMAGE_HEIGHT } from "@/lib/parchi-config";
import { drawParchi, ensureFontsLoaded, loadManropeFont } from "@/lib/parchi-utils";

export interface ParchiPreviewHandle {
  getCanvas: () => HTMLCanvasElement | null;
  redraw: () => Promise<void>;
}

interface ParchiPreviewProps {
  values: Record<string, string>;
}

const ParchiPreview = forwardRef<ParchiPreviewHandle, ParchiPreviewProps>(
  function ParchiPreview({ values }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const imgLoadedRef = useRef(false);

    const draw = useCallback(async () => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img || !imgLoadedRef.current) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      await ensureFontsLoaded(values);
      drawParchi(ctx, img, values);
    }, [values]);

    // Load font and background image once
    useEffect(() => {
      loadManropeFont().then(() => {
        if (imgLoadedRef.current) {
          draw();
        }
      });

      const img = new Image();
      img.src = "/images/masjid-parchi.png";
      img.onload = () => {
        imgRef.current = img;
        imgLoadedRef.current = true;
        draw();
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Redraw when values change
    useEffect(() => {
      draw();
    }, [draw]);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      redraw: draw,
    }));

    return (
      <div
        className="overflow-hidden rounded-xl border border-border bg-white"
        style={{ aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}` }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          role="img"
          aria-label="Parchi preview"
          className="block h-auto w-full"
        />
      </div>
    );
  }
);

export default ParchiPreview;

