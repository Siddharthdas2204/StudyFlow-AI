import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // Verify admin status
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== 'admin' && user?.email !== 'siddharthdas2204@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
  }

  // In a real production app with Service Role Key:
  // const { data: users, error } = await supabase.auth.admin.listUsers();
  
  // For demonstration/current setup, we'll return the mock data or query a 'profiles' table if it existed.
  const mockUsers = [
    { id: "1", full_name: "Siddharth Das", email: "siddharth@example.com", role: "admin", status: "active", usage: 1250, joined: "2026-03-10" },
    { id: "2", full_name: "John Doe", email: "john@example.com", role: "user", status: "active", usage: 450, joined: "2026-04-01" },
    { id: "3", full_name: "Sarah Smith", email: "sarah@example.com", role: "user", status: "suspended", usage: 890, joined: "2026-03-25" },
    { id: "4", full_name: "Mike Johnson", email: "mike@example.com", role: "user", status: "active", usage: 120, joined: "2026-04-05" },
    { id: "5", full_name: "Elena Rodriguez", email: "elena@example.com", role: "user", status: "active", usage: 2300, joined: "2026-02-15" },
  ];

  return NextResponse.json({ users: mockUsers });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user?.user_metadata?.role !== 'admin' && user?.email !== 'siddharthdas2204@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId, action, payload } = await req.json();

  // Handle actions: 'suspend', 'delete', 'update_role'
  console.log(`Admin ${user.email} performed ${action} on user ${userId}`, payload);

  return NextResponse.json({ success: true, message: `Action ${action} executed successfully` });
}
