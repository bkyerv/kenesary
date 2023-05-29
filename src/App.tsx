import {
  Link,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import Residents from "./room/Residents";
import Transactions from "./room/Transactions";
import Auth from "./Auth";
import Room from "./room/Room";
import AddNewInventory from "./room/NewInventory";
import NewResidentForm from "./room/NewResident";
import RoomInfo, { loader as inventoryLoader } from "./room/RoomInfo";
import { action as addResident } from "./room/NewResident";

import { loader as roomsLoader } from "./Rooms";
import { action as addInventory } from "./room/NewInventory";
import { action as deleteInventory } from "./room/RoomInfo";
import { loader as residentsLoader } from "./room/Residents";
import { action as residentAction } from "./room/Residents";
import { action as roomAction } from "./Rooms";
import { requireAuth } from "./utils/requireAuth";
import { action as loginAction } from "./Auth";
import { action as paymentAction } from "./room/Transactions";
import { loader as paymentLoader } from "./room/Transactions";
import Rooms from "./Rooms";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Auth />} action={loginAction} />
      <Route element={<Layout />}>
        {/* <Route path="/" element={<h2>Сначала надо авторизоваться</h2>} /> */}
        <Route
          path="/rooms"
          element={<Rooms />}
          loader={roomsLoader}
          action={roomAction}
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
            element={<RoomInfo />}
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
            action={residentAction}
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
          <Route
            path="transactions"
            element={<Transactions />}
            loader={paymentLoader}
            action={paymentAction}
          />
        </Route>
      </Route>
    </>
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

export default App;
