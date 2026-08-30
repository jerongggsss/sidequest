"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

type Props = {
  name: string;
  label: string;
  hint?: string;
  currentUrl?: string | null;
  aspectClass?: string; // e.g. "aspect-[4/5]" or "aspect-[16/9]"
  onChange?: (dataUrl: string | null) => void;
};

export function ImageUploadField({
  name,
  label,
  hint,
  currentUrl,
  aspectClass = "aspect-[16/9]",
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [removing, setRemoving] = useState(false);

  function handleFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      setRemoving(false);
      onChange?.(url);
    };
    reader.readAsDataURL(file);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    setRemoving(true);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const hasImage = preview && !removing;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}

      {/* Hidden remove flag */}
      {removing && (
        <input type="hidden" name={`remove${name.charAt(0).toUpperCase() + name.slice(1)}`} value="true" />
      )}

      <div
        className={`relative ${aspectClass} w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-brand hover:bg-brand/5`}
        onClick={() => inputRef.current?.click()}
      >
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white backdrop-blur transition-colors hover:bg-rose-500"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <ImageIcon className="h-8 w-8 text-slate-300" />
            <div>
              <p className="text-sm font-medium text-slate-500">
                <span className="text-brand">Upload</span> or drag &amp; drop
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP</p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
