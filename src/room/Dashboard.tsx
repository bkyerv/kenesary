import { Link, Outlet, useParams } from "react-router-dom";

export default function Dashboard() {
  const params = useParams();
  return (
    <>
      <p className="">Комната {params.id}</p>
      <nav className="flex gap-2 py-4 text-sm text-blue-500">
        <Link to="./residents">Жители</Link>
        <Link to="./transactions">Платежи</Link>
        <Link to="./documents">Документы</Link>
        <Link to="./utilities">Комуналка</Link>
        <Link to="./inventory">Инвентарь</Link>
      </nav>
      <Outlet />
    </>
  );
}
