import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { options, imageUrls, selectedImage, prompt } = await req.json();

    const { data, error } = await supabase
      .from('cake_designs')
      .insert([
        {
          occasion: options.occasion,
          tiers: options.tiers,
          style: options.style,
          colour: options.colour,
          decoration: options.decoration,
          message: options.message,
          image_urls: imageUrls,
          selected_image: selectedImage,
          prompt,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ design: data });
  } catch (error) {
    console.error('Save design error:', error);
    return NextResponse.json(
      { error: 'Failed to save design' },
      { status: 500 }
    );
  }
}
