"use client";

import { useRef, useState, type DragEvent } from "react";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif";

export function ImageDropField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed.");
      onChange(body.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed px-3 py-4 text-center transition ${
          dragging ? "border-white/50 bg-white/5" : "border-white/15 hover:border-white/30"
        }`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-20 w-auto rounded object-cover" />
        ) : null}
        <span className="text-xs text-ink-secondary">
          {uploading ? "Uploading…" : "Drag & drop an image, or click to browse"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-1 text-xs text-ink-secondary hover:text-red-400"
        >
          Remove image
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
