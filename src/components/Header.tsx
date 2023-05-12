import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="flex gap-2">
      <Link to="/">Консоль</Link>
      <Link to="/rooms">Комнаты</Link>
      <Link to="/expenses">Расходы</Link>
      <Link
        to="/login"
        className="ml-auto outline outline-blue-300 px-2 py-1 rounded"
      >
        Login
      </Link>
    </nav>
  );
}
