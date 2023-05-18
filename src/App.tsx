import {
  Link,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import RoomDetails, { action } from "./room/RoomDetails";
import Residents from "./room/Residents";
import Transactions from "./room/Transactions";
import Auth from "./Auth";
import Room from "./room/Room";
import AddNewInventory from "./room/NewInventory";
import { loader as inventoryLoader } from "./room/RoomDetails";
import { action as addInventory } from "./room/NewInventory";
import { action as deleteInventory } from "./room/RoomDetails";
import { loader as residentsLoader } from "./room/Residents";
import { action as addResident } from "./room/NewResident";
import NewResidentForm from "./room/NewResident";
import { requireAuth } from "./utils/requireAuth";
import { action as loginAction } from "./Auth";

let aparts = Array.from({ length: 18 }, (_, i) => i + 1);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/login" element={<Auth />} action={loginAction} />
      <Route
        path="/"
        element={<Rooms />}
        loader={async () => {
          await requireAuth();
          return null;
        }}
      />
      <Route
        path="/rooms/:id"
        element={<Room />}
        loader={async () => {
          await requireAuth();
          return null;
        }}
      >
        <Route
          index
          element={<RoomDetails />}
          action={deleteInventory}
          loader={inventoryLoader}
        />
        <Route
          path="new-inventory"
          element={<AddNewInventory />}
          action={addInventory}
          loader={async () => {
            await requireAuth();
            return null;
          }}
        />
        <Route
          path="residents"
          element={<Residents />}
          loader={residentsLoader}
        />
        <Route
          path="new-resident"
          element={<NewResidentForm />}
          action={addResident}
          loader={async () => {
            await requireAuth();
            return null;
          }}
        />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
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
    <div className="grid grid-cols-4 gap-2 p-4 text-s">
      {aparts.map((item) => (
        <Link to={`/rooms/${item}`} key={item}>
          <button className="border border-pink-500 font-bold px-2 mx-auto h-16 w-16 flex items-center justify-center rounded-md">
            {item}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default App;
