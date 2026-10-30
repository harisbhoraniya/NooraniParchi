"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  canvasToBlob,
  getExportFilename,
  downloadBlob,
} from "@/lib/parchi-utils";

interface ParchiActionsProps {
  getCanvas: () => HTMLCanvasElement | null;
  redraw: () => Promise<void>;
  validate?: () => boolean;
  onClear: () => void;
}

export default function ParchiActions({
  getCanvas,
  redraw,
  onClear,
}: ParchiActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      await redraw();
      const canvas = getCanvas();
      if (!canvas) {
        toast.error("Canvas is not ready");
        return;
      }
      const blob = await canvasToBlob(canvas);
      if (!blob) {
        toast.error("Could not generate image");
        return;
      }
      const filename = getExportFilename();
      downloadBlob(blob, filename);
      toast.success("Parchi downloaded successfully!");
    } catch {
      toast.error("Failed to download image");
    } finally {
      setDownloading(false);
    }
  }, [getCanvas, redraw]);

  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      await redraw();
      const canvas = getCanvas();
      if (!canvas) {
        toast.error("Canvas is not ready");
        return;
      }
      const blob = await canvasToBlob(canvas);
      if (!blob) {
        toast.error("Could not generate image");
        return;
      }

      const filename = getExportFilename();
      const file = new File([blob], filename, { type: "image/png" });
      const shareText = "Assalamu Alaikum, aaj ki Noorani Masjid parchi.";

      // 1. Mobile Web Share API: share directly to WhatsApp without downloading
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: "Noorani Masjid Parchi",
            text: shareText,
          });
          toast.success("Shared on WhatsApp successfully!");
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            return;
          }
        }
      }
      let copiedToClipboard = false;
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof ClipboardItem !== "undefined"
      ) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          copiedToClipboard = true;
        } catch {
          copiedToClipboard = false;
        }
      }

      // 3. Automatic redirect to WhatsApp
      const isMobile =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const encodedMsg = encodeURIComponent(shareText);

      const waUrl = isMobile
        ? `whatsapp://send?text=${encodedMsg}`
        : `https://web.whatsapp.com/send?text=${encodedMsg}`;

      if (copiedToClipboard) {
        toast.success(
          "Parchi copied to clipboard! Paste (Ctrl+V) directly into WhatsApp.",
          { duration: 7000 }
        );
      } else {
        toast.info("Opening WhatsApp...", { duration: 4000 });
      }

      // Automatic redirect
      if (isMobile) {
        window.location.href = waUrl;
      } else {
        const opened = window.open(waUrl, "_blank", "noopener,noreferrer");
        // Fallback if popup blocked
        if (!opened) {
          window.location.href = waUrl;
        }
      }
    } catch {
      toast.error("Failed to share on WhatsApp");
    } finally {
      setSharing(false);
    }
  }, [getCanvas, redraw]);

  return (
    <div className="grid gap-3">
      <Button
        onClick={handleDownload}
        disabled={downloading}
        className="h-12 bg-emerald-700 text-white hover:bg-emerald-800"
        size="lg"
      >
        {downloading ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Download className="mr-2 size-4" />
        )}
        Download Parchi
      </Button>

      <Button
        onClick={handleShare}
        disabled={sharing}
        className="h-12 bg-[#25d366] text-[#07351a] hover:bg-[#20bd5a]"
        size="lg"
      >
        {sharing ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Share2 className="mr-2 size-4" />
        )}
        Share on WhatsApp
      </Button>

      <Button onClick={onClear} variant="outline" className="h-12" size="lg">
        <Trash2 className="mr-2 size-4" />
        Clear Form
      </Button>
    </div>
  );
}
