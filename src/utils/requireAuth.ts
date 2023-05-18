import { redirect } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw redirect("/login");
  }
  return session;
}
