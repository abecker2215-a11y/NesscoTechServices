"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface PhotoUploadProps {
  photos: string[];
  photoNames: string[];
  onChange: (photos: string[], photoNames: string[]) => void;
  maxFiles?: number;
}

const MAX_FILES = 3;
const MAX_DIMENSION = 1200;

function downscaleImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export function PhotoUpload({ photos, photoNames, onChange, maxFiles = MAX_FILES }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setError(null);
    const remaining = maxFiles - photos.length;
    if (remaining <= 0) {
      setError(`You can attach up to ${maxFiles} photos.`);
      return;
    }
    const accepted = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);
    if (accepted.length === 0) {
      setError("Please choose image files (JPG or PNG).");
      return;
    }
    setIsProcessing(true);
    try {
      const dataUrls = await Promise.all(accepted.map(downscaleImage));
      onChange(
        [...photos, ...dataUrls].slice(0, maxFiles),
        [...photoNames, ...accepted.map((f) => f.name)].slice(0, maxFiles)
      );
      trackEvent("photo_added", { count: accepted.length });
    } catch {
      setError("One of those images couldn't be processed. Try a different photo.");
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    trackEvent("photo_removed", {});
    onChange(
      photos.filter((_, i) => i !== index),
      photoNames.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {photos.map((src, i) => (
          <div key={`${photoNames[i] ?? i}-${i}`} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={photoNames[i] ? `Upload: ${photoNames[i]}` : `Upload ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
        {photos.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
          >
            <ImagePlus className="h-5 w-5" aria-hidden="true" />
            <span className="text-[11px] font-medium">{isProcessing ? "Adding…" : "Add photo"}</span>
          </button>
        )}
      </div>
      <input
        id="photo-upload"
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        aria-label="Upload photos of the problem"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Snap the error message, router label, or damage. Up to {maxFiles} photos — they stay on
        your device until you submit.
      </p>
      {error && (
        <p className="mt-1 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
