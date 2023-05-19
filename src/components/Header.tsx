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
    <nav className="">
      {!session ? (
        <div className="text-right">
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
        </div>
      ) : (
        <div className="flex justify-between py-2">
          {/* <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
          >
            Консоль
          </NavLink> */}
          <NavLink
            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
            to="/rooms"
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
            onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
            className="flex items-center gap-2 text-sm px-2 py-1 rounded"
          >
            <span>Выйти</span>
            <span className="text-xl">
              <ExitIcon />
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}

function ExitIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4l-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z"
      ></path>
    </svg>
  );
}
