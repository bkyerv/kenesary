import { Routes, Link, BrowserRouter, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./room/Dashboard";
import Residents from "./room/Residents";
import Transactions from "./room/Transactions";
import Documents from "./room/Documents";
import Utilities from "./room/Utitilities";
import Expenses from "./Expenses";
import Inventory from "./room/Inventory";
import ResidentDetails from "./room/ResidentDetails";
import Auth from "./Auth";

let aparts = Array.from({ length: 18 }, (_, i) => i + 1);

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-xs mx-auto h-screen py-8 ">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/rooms/:id" element={<Dashboard />}>
              <Route path="/rooms/:id/residents" element={<Residents />} />
              <Route
                path="/rooms/:id/residents/:id"
                element={<ResidentDetails />}
              />
              <Route
                path="/rooms/:id/transactions"
                element={<Transactions />}
              />
              <Route path="/rooms/:id/documents" element={<Documents />} />
              <Route path="/rooms/:id/utilities" element={<Utilities />} />
              <Route path="/rooms/:id/inventory" element={<Inventory />} />
            </Route>
          </Route>
        </Routes>
      </div>
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
