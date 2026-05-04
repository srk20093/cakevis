'use client';

import { CakeOptions } from '@/app/api/generate/route';

interface CakeFormProps {
  options: CakeOptions;
  onChange: (options: CakeOptions) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const OCCASIONS = ['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Baby Shower', 'Engagement', 'Corporate', 'Other'];
const TIERS = ['1', '2', '3', '4', '5'];
const STYLES = ['Classic', 'Rustic', 'Modern', 'Floral', 'Fondant', 'Buttercream', 'Naked', 'Drip'];
const COLOURS = ['White', 'Ivory', 'Pink', 'Gold', 'Silver', 'Blue', 'Red', 'Purple', 'Green', 'Black', 'Pastel', 'Rainbow'];
const DECORATIONS = [
  'Fresh flowers', 'Sugar flowers', 'Macarons', 'Chocolate shards',
  'Gold leaf', 'Sprinkles', 'Fruit', 'Edible glitter', 'Ribbons', 'Pearls',
];

export default function CakeForm({ options, onChange, onGenerate, isGenerating }: CakeFormProps) {
  const update = (field: keyof CakeOptions, value: string) =>
    onChange({ ...options, [field]: value });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-amber-600 text-sm font-semibold">N</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Nafees Bakers</h1>
            <p className="text-xs text-gray-500">Cake Visualiser</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        <FormField label="Occasion">
          <Select
            value={options.occasion}
            options={OCCASIONS}
            placeholder="Select occasion"
            onChange={(v) => update('occasion', v)}
          />
        </FormField>

        <FormField label="Number of Tiers">
          <div className="flex gap-2">
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => update('tiers', t)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  options.tiers === t
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-amber-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Cake Style">
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => update('style', s)}
                className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                  options.style === s
                    ? 'bg-amber-500 border-amber-500 text-white font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-amber-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Colour Scheme">
          <Select
            value={options.colour}
            options={COLOURS}
            placeholder="Select colour"
            onChange={(v) => update('colour', v)}
          />
        </FormField>

        <FormField label="Decoration">
          <Select
            value={options.decoration}
            options={DECORATIONS}
            placeholder="Select decoration"
            onChange={(v) => update('decoration', v)}
          />
        </FormField>

        <FormField label="Personalised Message">
          <input
            type="text"
            value={options.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="e.g. Happy Birthday Sarah!"
            maxLength={60}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">{options.message.length}/60 characters</p>
        </FormField>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-xl transition-colors text-sm tracking-wide shadow-sm"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            'Generate Cake Designs'
          )}
        </button>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent appearance-none cursor-pointer"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
