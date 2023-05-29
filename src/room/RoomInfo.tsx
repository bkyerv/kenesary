import {
  Form,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import {
  fetchInventory,
  deleteIventory,
  editInventory,
} from "../api/inventory";
import { requireAuth } from "../utils/requireAuth";
import { useEffect, useState } from "react";
import { AddIcon, DeleteIcon, EditIcon } from "../components/icons/icons";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

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
    <div className="text-sm flex-auto flex flex-col ">
      <div className="text-right">
        <Link to="new-inventory">
          <button className=" text-blue-500 ">
            <AddIcon />
          </button>
        </Link>
      </div>
      {inventories.length === 0 ? (
        <p className="mt-12 text-sm font-light">
          Выглядит, что мы им ничего не дали, но если дали и еще не записали, то
          можно это сделать сейчас нажав на кнопку "+"
        </p>
      ) : (
        <div className="flex flex-col gap-4 mt-8">
          {inventories.map((item) => (
            <div
              key={item.id}
              className={beingEdited ? "" : "p-1 border-b border-gray-100 pl-2"}
            >
              {item.id === beingEdited ? (
                <div className="relative border p-1 border-pink-500">
                  {beingEdited && (
                    <span className="text-xs block mb-2 text-pink-500">
                      Режим редакитрования
                    </span>
                  )}
                  <Form method="post" className="grid grid-cols-4">
                    <div className="col-span-3">
                      <div>
                        <input
                          type="text"
                          name="residentName"
                          className="px-1"
                          autoFocus
                          defaultValue={item.description}
                        />
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs font-light text-slate-500">
                          Дата выдачи
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
                        className="text-md px-1 my-1 text-green-700"
                      >
                        &#10003;
                      </button>
                      <button
                        onClick={() => {
                          setBeingEdited(null);
                        }}
                        className="text-md px-1 my-1 text-red-500"
                      >
                        &#x2715;
                      </button>
                    </div>
                  </Form>
                </div>
              ) : (
                <div className="grid grid-cols-4 ">
                  <div className="col-span-3">
                    <div className="">{item.description}</div>
                    <div className="mt-2">
                      <span className="block text-xs font-light text-slate-500">
                        Дата выдачи:
                      </span>
                      <span className="text-xs">
                        {format(new Date(item.given_date), "dd MMM yyyy", {
                          locale: ru,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-around">
                    <button
                      onClick={() => setBeingEdited(item.id)}
                      className="text-blue-500"
                    >
                      <EditIcon />
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
                        className="text-red-500"
                      >
                        <DeleteIcon />
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
