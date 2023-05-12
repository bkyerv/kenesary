import { Session, createClient } from "@supabase/supabase-js";
import { FormEvent, useEffect, useState } from "react";

export default function Auth() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  }

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  return !session ? (
    <form onSubmit={handleSubmit}>
      <div>
        <label>email</label>
        <input type="email" name="email" className="border rounded w-full" />
      </div>
      <div>
        <label>password</label>
        <input
          type="password"
          name="password"
          className="border rounded w-full"
        />
      </div>
      <button>Login</button>
    </form>
  ) : (
    <pre>{JSON.stringify(session?.user, null, 2)}</pre>
  );
}
