import { NavLink, Outlet, useParams } from "react-router-dom";

export default function Room() {
  const params = useParams();
  return (
    <>
      <nav className="flex gap-2 py-4 text-sm text-blue-500">
        <NavLink
          to="."
          end
          className={({ isActive }) => (isActive ? "underline" : "")}
        >
          Главная
        </NavLink>
        <NavLink
          to="residents"
          className={({ isActive }) => (isActive ? "underline" : "")}
        >
          Жители
        </NavLink>
        <NavLink
          to="transactions"
          className={({ isActive }) => (isActive ? "underline" : "")}
        >
          Платежи
        </NavLink>
      </nav>
      <h2 className="text-3xl font-bold">{params.id}</h2>
      <Outlet />
    </>
  );
}
