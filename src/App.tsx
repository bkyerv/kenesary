import { Routes, Link, BrowserRouter, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RoomDetails from "./room/RoomDetails";
import Residents from "./room/Residents";
import Transactions from "./room/Transactions";
import Expenses from "./Expenses";
import Auth from "./Auth";
import Room from "./room/Room";

let aparts = Array.from({ length: 18 }, (_, i) => i + 1);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/expenses" element={<Expenses />} />

          <Route path="/rooms/:id" element={<Room />}>
            <Route index element={<RoomDetails />} />
            <Route path="residents" element={<Residents />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Index() {
  return (
    <div>
      <h1>Index</h1>
    </div>
  );
}

function Rooms() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 text-s">
      {aparts.map((item) => (
        <Link to={`/rooms/${item}`} key={item}>
          <button className="bg-gray-200 mx-auto h-7 w-7 flex items-center justify-center rounded-full">
            {item}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default App;
