'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CakePreviewProps {
  images: string[];
  isGenerating: boolean;
  onSave: (selectedIndex: number) => void;
  isSaving: boolean;
}

export default function CakePreview({ images, isGenerating, onSave, isSaving }: CakePreviewProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-700">Preview</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {images.length > 0 ? `${images.length} designs generated — click to select` : 'Your cake design will appear here'}
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Main preview */}
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 min-h-[280px]">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Creating your designs…</p>
            </div>
          ) : images.length > 0 ? (
            <Image
              src={images[selected]}
              alt={`Cake design ${selected + 1}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selected === i
                    ? 'border-amber-500 shadow-md'
                    : 'border-gray-100 hover:border-amber-200'
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Save button */}
      {images.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => onSave(selected)}
            disabled={isSaving}
            className="flex-1 py-2.5 px-4 bg-white border border-amber-300 hover:bg-amber-50 disabled:opacity-50 text-amber-700 font-medium rounded-xl text-sm transition-colors"
          >
            {isSaving ? 'Saving…' : 'Save Design'}
          </button>
          <a
            href={images[selected]}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium rounded-xl text-sm transition-colors"
          >
            Open Full Size
          </a>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
        <svg className="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">No design yet</p>
        <p className="text-xs text-gray-400 mt-1">Fill in the options and click<br />"Generate Cake Designs"</p>
      </div>
    </div>
  );
}
