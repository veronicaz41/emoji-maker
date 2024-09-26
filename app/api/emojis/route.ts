import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const { data, error } = await supabase
    .from('emojis')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching emojis:', error);
    return NextResponse.json({ error: 'Error fetching emojis' }, { status: 500 });
  }

  return NextResponse.json(data);
}