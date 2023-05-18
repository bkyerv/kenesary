import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

export default function Header() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
  }, []);

  return (
    <nav className="flex gap-2">
      {!session ? (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `ml-auto outline outline-blue-300 px-2 py-1 rounded ${
              isActive ? "text-blue-500" : ""
            }`
          }
        >
          Login
        </NavLink>
      ) : (
        <>
          {/* <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            Консоль
          </NavLink> */}
          <NavLink
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
            to="/"
          >
            Комнаты
          </NavLink>
          {/* <NavLink
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
            to="/expenses"
          >
            Расходы
          </NavLink> */}

          <button
            onClick={() => {
              supabase.auth.signOut();
              return navigate("/login");
            }}
          >
            logout
          </button>
        </>
      )}
    </nav>
  );
}
