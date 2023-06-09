import { NavLink, Outlet, useParams } from "react-router-dom";

export default function Room() {
  const params = useParams();
  return (
    <>
      <h2 className="text-3xl font-bold">Комната №{params.id}</h2>
      <nav className="flex gap-2 py-4 text-sm text-blue-500">
        <NavLink
          to="."
          end
          className={({ isActive }) => (isActive ? "underline" : "")}
        >
          Платежи
        </NavLink>
        <NavLink
          to="residents"
          className={({ isActive }) => (isActive ? "underline" : "")}
        >
          Жители
        </NavLink>
        <NavLink
          to="info"
          className={({ isActive }) => (isActive ? "underline" : "")}
        >
          Общая информация
        </NavLink>
      </nav>
      <Outlet />
    </>
  );
}
