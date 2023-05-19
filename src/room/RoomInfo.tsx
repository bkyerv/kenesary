import {
  Form,
  Link,
  LoaderFunctionArgs,
  Outlet,
  useLoaderData,
} from "react-router-dom";
import {
  fetchInventory,
  deleteIventory,
  editInventory,
} from "../api/inventory";
import { requireAuth } from "../utils/requireAuth";
import { useEffect, useState } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  await requireAuth();
  const data = await fetchInventory(params.id);
  return data;
}

type Inventories = Awaited<ReturnType<typeof loader>>;

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  if (_action === "delete") {
    await deleteIventory(values.id as string);
  }
  if (_action === "edit") {
    await editInventory(values);
  }
  return null;
}

export default function RoomInfo() {
  const inventories = useLoaderData() as Inventories;
  const [beingEdited, setBeingEdited] = useState<string | null>(null);
  useEffect(() => {
    setBeingEdited(null);
  }, [inventories]);

  return (
    <div className="text-sm p-4 flex-auto flex flex-col">
      <div className="text-right mt-2">
        <Link to="new-inventory">
          <button className="bg-blue-500 text-blue-50 px-2 py-1 rounded">
            + Добавить
          </button>
        </Link>
      </div>
      {inventories.length === 0 ? (
        <p className="mt-16 text-sm font-light">
          Выглядит, что мы им ничего не дали, но если дали и еще не записали, то
          можно это сделать сейчас нажав на кнопку "+Добавить"
        </p>
      ) : (
        <div className="flex flex-col gap-2 mt-2 py-2">
          {inventories.map((item) => (
            <div key={item.id} className="p-2 pt-6 ">
              {item.id === beingEdited ? (
                <div className="relative ">
                  <Form method="post" className="grid grid-cols-4">
                    <div className="col-span-3">
                      <div>
                        <input
                          type="text"
                          name="residentName"
                          className=""
                          defaultValue={item.description}
                        />
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs font-light text-slate-500">
                          Дата заезда
                        </label>
                        <input
                          type="date"
                          name="movingIn"
                          className="text-xs"
                          defaultValue={item.given_date.substring(0, 10)}
                        />
                      </div>
                      <input
                        type="text"
                        hidden
                        name="id"
                        defaultValue={item.id}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-1 ">
                      <button
                        type="submit"
                        value="edit"
                        name="_action"
                        className="text-md px-1 my-1"
                      >
                        &#10003;
                      </button>
                      <button
                        onClick={() => {
                          setBeingEdited(null);
                        }}
                        className="text-md px-1 my-1"
                      >
                        &#x2715;
                      </button>
                    </div>
                  </Form>
                </div>
              ) : (
                <div className="grid grid-cols-4 ">
                  <div className="col-span-3">
                    <div className="pr-2">{item.description}</div>
                    <div className="mt-2">
                      <span className="block text-xs font-light text-slate-500">
                        Дата выдачи:
                      </span>
                      <span className="text-xs">
                        {item.given_date.substring(0, 10)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 px-2">
                    <button
                      onClick={() => setBeingEdited(item.id)}
                      className="outline outline-1 outline-blue-500 px-1 my-1  rounded"
                    >
                      Edit
                    </button>
                    <Form method="post">
                      <input
                        type="text"
                        name="id"
                        hidden
                        defaultValue={item.id}
                      />
                      <button
                        name="_action"
                        value="delete"
                        className="outline outline-1 outline-blue-500 px-1 my-1 rounded"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
