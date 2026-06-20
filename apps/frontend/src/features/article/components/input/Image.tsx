"use client";

import React, { useRef } from "react";

import { useImageUpload } from "@/hooks/useImageUpload";
import { Image as ImageType } from "@pc-builder/shared/article";

interface ImageInputProps {
  content: ImageType;
  onChange: (val: { src: string; caption: string }) => void;
}

export function ImageInput({ content, onChange }: ImageInputProps) {
  const { upload: uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "articles");
      onChange({ src: url, caption: content.caption });
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Image upload failed. Please try again.");
    }
  };

  return (
    <div className="my-4 mx-auto flex flex-col items-center max-w-2xl w-full">
      {content.src ? (
        <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group/img">
          <img
            src={content.src}
            className="max-h-[360px] w-full object-cover select-none"
            alt={content.caption}
          />
          <button
            type="button"
            onClick={() => onChange({ src: "", caption: content.caption })}
            className="absolute top-2 right-2 bg-slate-900/60 text-white hover:bg-red-600 rounded-xl px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all"
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-500">Uploading Image...</span>
            </div>
          ) : (
            <>
              <span className="text-3xl">🖼️</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
                Upload an image file
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Supports JPG, PNG, GIF
              </span>
            </>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Write a caption..."
        defaultValue={content.caption}
        onChange={(e) => onChange({ src: content.src, caption: e.target.value })}
        className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-sans italic text-center w-full bg-transparent border-none focus:outline-none"
      />
    </div>
  );
}
