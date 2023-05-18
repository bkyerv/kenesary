import { createClient } from "@supabase/supabase-js";
import {
  Form,
  Link,
  LoaderFunctionArgs,
  Outlet,
  useLoaderData,
} from "react-router-dom";
import { fetchInventory, deleteIventory } from "../api/inventory";
import { requireAuth } from "../utils/requireAuth";

interface Inventory {
  created_at: string;
  description: string;
  given_date: string;
  id: string;
  room_number: number;
  updated_at: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  await requireAuth();
  const data = await fetchInventory(params.id);
  return data;
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const { _action, id } = Object.fromEntries(formData);
  if (_action === "delete") {
    await deleteIventory(id as string);
  }
  return null;
}

export default function Dashboard() {
  const inventory = useLoaderData();

  return (
    <div className="text-sm p-4 ">
      <div className="text-right mt-2">
        <Link to="new-inventory">
          <button className="bg-blue-500 text-blue-50 px-2 py-1 rounded">
            + Добавить
          </button>
        </Link>
      </div>
      <Outlet />
      <RenderInventoryItems inventory={inventory} />
    </div>
  );
}

function RenderInventoryItems({ inventory }: { inventory: any }) {
  return (
    <>
      <div className="flex flex-col gap-2 mt-2 ">
        {!inventory ? (
          <p>...loading</p>
        ) : inventory.length == 0 ? (
          <p>
            Выглядит, что мы им ничего не дали, но если дали и еще не записали,
            то можно это сделать сейчас нажав на кнопку "+Добавить"
          </p>
        ) : (
          <p className="underline">Мы им дали: </p>
        )}
        {inventory?.map((item: Inventory) => (
          <Inventory key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}

function Inventory({ item }: { item: Inventory }) {
  return (
    <div className=" relative border rounded p-2 pt-6 grid grid-cols-4 ">
      {/* <span className="absolute px-2 bg-blue-100 rounded text-blue-900 ">
        {item.condition === "новый" ? "Новый" : ""}
      </span> */}
      <div className="col-span-3">
        <div className="pr-2">{item.description}</div>
        <div className="mt-2">
          <span className="block text-xs font-light text-slate-500">Date:</span>
          <span className="text-xs">{item.given_date}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-2">
        <button className="outline outline-1 outline-blue-500 px-1 my-1  rounded">
          Edit
        </button>
        <Form method="post">
          <input type="text" hidden name="id" defaultValue={item.id} />
          <button
            type="submit"
            name="_action"
            value="delete"
            className="outline outline-1 outline-blue-500 px-1 my-1 rounded"
          >
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}
