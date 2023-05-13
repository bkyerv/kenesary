import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="flex gap-2">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "text-blue-500" : "")}
      >
        Консоль
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "text-blue-500" : "")}
        to="/rooms"
      >
        Комнаты
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "text-blue-500" : "")}
        to="/expenses"
      >
        Расходы
      </NavLink>
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
    </nav>
  );
}
