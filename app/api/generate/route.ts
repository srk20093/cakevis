import { NextRequest, NextResponse } from 'next/server';
import { replicate } from '@/lib/replicate';

export const maxDuration = 60;

export interface CakeOptions {
  occasion: string;
  tiers: string;
  style: string;
  colour: string;
  decoration: string;
  message: string;
}

function buildPrompt(options: CakeOptions): string {
  const parts = [
    `A professional bakery photograph of a beautiful ${options.tiers}-tier ${options.style} cake`,
    options.occasion ? `for a ${options.occasion}` : '',
    options.colour ? `with ${options.colour} colour scheme` : '',
    options.decoration ? `decorated with ${options.decoration}` : '',
    options.message ? `featuring the inscription "${options.message}"` : '',
    'on a clean white background, studio lighting, photorealistic, high quality, 4k',
  ];

  return parts.filter(Boolean).join(', ');
}

function extractUrl(output: unknown): string {
  if (typeof output === 'string') return output;
  if (output && typeof (output as { url?: () => string }).url === 'function') {
    return (output as { url: () => string }).url();
  }
  if (Array.isArray(output) && output.length > 0) return extractUrl(output[0]);
  return String(output);
}

export async function POST(req: NextRequest) {
  try {
    const options: CakeOptions = await req.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(options);
    const imageUrls: string[] = [];

    for (let i = 0; i < 3; i++) {
      const output = await replicate.run('black-forest-labs/flux-1.1-pro', {
        input: {
          prompt,
          width: 1024,
          height: 1024,
          output_format: 'webp',
          output_quality: 90,
        },
      });
      imageUrls.push(extractUrl(output));
    }

    return NextResponse.json({ images: imageUrls, prompt });
  } catch (error) {
    console.error('Generate error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate images';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
