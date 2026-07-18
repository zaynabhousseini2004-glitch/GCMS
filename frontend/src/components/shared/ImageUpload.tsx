"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  currentUrl?: string | null;
  onFileSelect: (file: File) => void;
  isPending?: boolean;
  label?: string;
  className?: string;
}

/**
 * A simple image upload widget. Previews the current image (or selected file),
 * and triggers `onFileSelect` when the user picks a new file. The parent is
 * responsible for calling the upload mutation.
 */
export function ImageUpload({
  currentUrl,
  onFileSelect,
  isPending = false,
  label = "Upload Image",
  className = "",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  }

  function handleClear() {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const displayUrl = preview ?? currentUrl;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {displayUrl ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
          <Image
            src={displayUrl}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          {preview && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground">
          <Upload size={28} />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? "Uploading…" : label}
      </Button>
    </div>
  );
}
