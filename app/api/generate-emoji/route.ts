import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import Replicate from 'replicate';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt } = await request.json();

  try {
    // Generate emoji using Replicate
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      { input: { prompt, apply_watermark: false } }
    );

    if (typeof output === 'string') {
      // Upload emoji to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('emojis')
        .upload(`${userId}/${Date.now()}.png`, await fetch(output).then(res => res.blob()));

      if (uploadError) {
        console.error('Error uploading emoji:', uploadError);
        return NextResponse.json({ error: 'Error uploading emoji' }, { status: 500 });
      }

      // Get public URL of uploaded emoji
      const { data: { publicUrl } } = supabase.storage
        .from('emojis')
        .getPublicUrl(uploadData.path);

      // Insert emoji data into emojis table
      const { error: insertError } = await supabase
        .from('emojis')
        .insert({
          image_url: publicUrl,
          prompt,
          creator_user_id: userId
        });

      if (insertError) {
        console.error('Error inserting emoji data:', insertError);
        return NextResponse.json({ error: 'Error inserting emoji data' }, { status: 500 });
      }

      return NextResponse.json({ success: true, imageUrl: publicUrl });
    } else {
      return NextResponse.json({ error: 'Invalid output from Replicate' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating emoji:', error);
    return NextResponse.json({ error: 'Error generating emoji' }, { status: 500 });
  }
}