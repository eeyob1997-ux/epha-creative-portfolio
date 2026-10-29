import { createClient } from "@/lib/supabase/server";

export async function isAdmin(): Promise<boolean> {
  const adminUserId = process.env.SUPABASE_ADMIN_USER_ID;

  if (!adminUserId) {
    return false;
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return false;
    }

    return user.id === adminUserId;
  } catch {
    return false;
  }
}
