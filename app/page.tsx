'use client';

import { useState } from 'react';
import CakeForm from '@/components/CakeForm';
import CakePreview from '@/components/CakePreview';
import { CakeOptions } from '@/app/api/generate/route';

const defaultOptions: CakeOptions = {
  occasion: '',
  tiers: '1',
  style: '',
  colour: '',
  decoration: '',
  message: '',
};

export default function Home() {
  const [options, setOptions] = useState<CakeOptions>(defaultOptions);
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Generation failed');
      }

      setImages(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave(selectedIndex: number) {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/save-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          options,
          imageUrls: images,
          selectedImage: images[selectedIndex],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Save failed');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save design');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-xl">🎂</span>
          <span className="font-semibold text-gray-800 text-sm tracking-wide">
            Nafees Bakers — Cake Visualiser
          </span>
        </div>
        <span className="text-xs text-gray-400 hidden sm:block">
          Powered by AI · Professional Cake Design
        </span>
      </header>

      {/* Status messages */}
      {(error || saveSuccess) && (
        <div
          className={`mx-4 mt-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
            error
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {error ?? 'Design saved successfully!'}
        </div>
      )}

      {/* Main split layout */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left panel — form */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] bg-white border-b lg:border-b-0 lg:border-r border-gray-100 p-6 lg:p-8 overflow-y-auto">
          <CakeForm
            options={options}
            onChange={setOptions}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </aside>

        {/* Right panel — preview */}
        <section className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <CakePreview
            images={images}
            isGenerating={isGenerating}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </section>
      </main>
    </div>
  );
}
