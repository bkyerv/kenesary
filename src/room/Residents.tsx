import {
  ActionFunctionArgs,
  Form,
  Link,
  useLoaderData,
} from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { deleteResident, editResident, getResidents } from "../api/resident";
import { requireAuth } from "../utils/requireAuth";
import { useEffect, useState } from "react";
import { AddIcon, DeleteIcon, EditIcon } from "../components/icons/icons";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  if (_action === "delete") {
    await deleteResident(values.id as string);
  }

  if (_action === "edit") {
    const res = await editResident(
      values as { residentName: string; id: string; movingIn: string }
    );
  }

  return null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  await requireAuth();
  const data = await getResidents(params.id as string);
  return data;
}

export default function Residents() {
  const residents = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const [beingEdited, setBeingEdited] = useState<string | null>(null);
  useEffect(() => {
    setBeingEdited(null);
  }, [residents]);

  return (
    <div className="text-sm flex-auto flex flex-col ">
      <div className="text-right">
        <Link to="../new-resident">
          <button className=" text-blue-500 py-1 rounded">
            <AddIcon />
          </button>
        </Link>
      </div>
      {residents.length === 0 ? (
        <p className="mt-12 font-light">
          В этой комнате никто не проживает. Чтобы добавить жителя нажмите на
          кнопку "+"
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {residents.map((item) => (
            <div
              key={item.id}
              className={beingEdited ? "" : "border-l border-gray-300 pl-2"}
            >
              {item.id === beingEdited ? (
                <div className="relative ">
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
                          defaultValue={item.resident_name}
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
                          defaultValue={item.moving_in.substring(0, 10)}
                        />
                      </div>
                      <input
                        type="text"
                        hidden
                        name="id"
                        defaultValue={item.id}
                      />
                    </div>
                    <div className="flex justify-between gap-1 ">
                      <button
                        type="submit"
                        value="edit"
                        name="_action"
                        className="text-green-800 flex-auto text-md px-1 my-1 rounded"
                      >
                        &#10003;
                      </button>
                      <button
                        onClick={() => {
                          setBeingEdited(null);
                        }}
                        className="text-red-500 flex-auto text-md px-1 my-1 rounded"
                      >
                        &#x2715;
                      </button>
                    </div>
                  </Form>
                </div>
              ) : (
                <div className="grid grid-cols-4 ">
                  <div className="col-span-3">
                    <div className="">
                      <span className="text-xs text-gray-400">Имя: </span>
                      {item.resident_name}
                    </div>
                    <div className="mt-2">
                      <span className="block text-xs font-light text-slate-500">
                        Дата заезда:
                      </span>
                      <span className="text-xs">
                        {format(new Date(item.moving_in), "d MMM yyyy", {
                          locale: ru,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-around">
                    <button
                      onClick={(e) => setBeingEdited(item.id)}
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
