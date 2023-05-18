import { ActionFunctionArgs, Link, useLoaderData } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { getResidents } from "../api/resident";
import { requireAuth } from "../utils/requireAuth";

export async function action({ request, params }: ActionFunctionArgs) {
  return null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  await requireAuth();
  const data = await getResidents(params.id as string);
  console.log(data);
  return data;
}

export default function Residents() {
  const residents = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  return (
    <div className="text-sm p-4">
      <div className="text-right mt-2">
        <Link to="../new-resident">
          <button className="bg-blue-500 text-blue-50 px-2 py-1 rounded">
            + Добавить
          </button>
        </Link>
      </div>
      {/* <p className="underline">Мы им дали: </p> */}
      <div className="flex flex-col gap-2 mt-4">
        {residents.map((item) => (
          <div key={item.id} className="p-2 pt-6 grid grid-cols-4 ">
            <span className="absolute px-2 bg-blue-100 rounded text-blue-900 "></span>
            <div className="col-span-3">
              <div className="pr-2">{item.resident_name}</div>
              <div className="mt-2">
                <span className="block text-xs font-light text-slate-500">
                  Дата заезда:
                </span>
                <span className="text-xs">{item.moving_in}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 px-2">
              <button className="outline outline-1 outline-blue-500 px-1 my-1  rounded">
                Edit
              </button>
              <button className="outline outline-1 outline-blue-500 px-1 my-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
