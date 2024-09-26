import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sql } from '@vercel/postgres';
import { auth } from '@clerk/nextjs/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { emojiId, like } = await request.json();

  const { data, error } = await supabase
    .from('emojis')
    .update({ likes_count: like ? sql`likes_count + 1` : sql`likes_count - 1` })
    .eq('id', emojiId)
    .select('likes_count');

  if (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Error updating likes' }, { status: 500 });
  }

  return NextResponse.json({ likes_count: data[0].likes_count });
}