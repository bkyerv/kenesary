import {
  ActionFunctionArgs,
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
} from "react-router-dom";
import { AddIcon } from "./components/icons/icons";
import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabase/supabaseClient";
import { requireAuth } from "./utils/requireAuth";
import { isThisMonth, parse, parseISO } from "date-fns";

let aparts = Array.from({ length: 18 }, (_, i) => i + 1);

export async function loader() {
  await requireAuth();
  const { data: rooms, error: roomsError } = await supabase
    .from("room")
    .select("*");

  if (roomsError) {
    return console.error(roomsError);
  }

  const { data: debtStatus, error: debtStatusError } = await supabase
    .from("debt")
    .select("*");

  if (debtStatusError) {
    return console.error(debtStatusError);
  }

  // console.log(parseISO(debtStatus[0].settled_period));

  const currentMonthDebtStatus: { [key: string]: boolean } = debtStatus.reduce(
    (acc: { [key: string]: boolean }, debt: (typeof debtStatus)[0]) => {
      if (debt.settled_period) {
        const date = parseISO(debt.settled_period);
        const isThisMonthDebt = isThisMonth(date);
        if (isThisMonthDebt) {
          acc[debt.room_number.toString()] = true;
        }
      }
      return acc;
    },
    {}
  );

  return { rooms, currentMonthDebtStatus };
}

export type Rooms = Awaited<ReturnType<typeof loader>>;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const { data, error } = await supabase
    .from("room")
    .insert([{ number: parseInt(values.roomNumber as string) }]);

  if (error) {
    return error;
  }

  return data;
  // return null;
}

export default function Rooms() {
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const data = useLoaderData() as Rooms;

  return (
    <div className="h-full">
      {showAddRoomForm ? (
        <AddRoomForm setShowAddRoomForm={setShowAddRoomForm} />
      ) : (
        <>
          <div className="mb-4 text-xs">
            <button
              onClick={() => setShowAddRoomForm(true)}
              className="ml-auto flex items-center gap-1 bg-slate-500 text-white p-2 rounded "
            >
              <AddIcon w="16" h="16" />
              <span>Добавить</span>
            </button>
          </div>
          <RenderRooms data={data} />
        </>
      )}
    </div>
  );
}

function RenderRooms({ data }: { data: Rooms }) {
  if (data) {
    console.log(data.currentMonthDebtStatus["1"]);
  }
  return (
    <div className="grid grid-cols-4 gap-0.5 p-1.5 text-s ">
      {data?.rooms
        ?.sort((a, b) => a.number - b.number)
        .map((room) => (
          <Link to={`/rooms/${room.number}`} key={room.id}>
            <button className="relative border border-pink-500 font-bold px-2 mx-auto h-16 w-16 flex items-center justify-center rounded-md">
              {room.number}
              <span
                className={
                  !data.currentMonthDebtStatus[room.number.toString()]
                    ? "absolute bg-red-500 rounded w-2 h-2 bottom-2"
                    : ""
                }
              ></span>
            </button>
          </Link>
        ))}
    </div>
  );
}

function AddRoomForm({ setShowAddRoomForm }: { setShowAddRoomForm: any }) {
  const [error, setError] = useState("");
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.code === "23505") {
      return setError("Такая комната уже существует");
    }
    if (fetcher.state === "loading") {
      setError("");
      setTimeout(() => {
        setShowAddRoomForm(false);
      }, 1000);
    }
  }, [fetcher]);

  return (
    <fetcher.Form className="px-2" method="post">
      <label className="text-sm">Номер комнаты</label>
      <div className="flex gap-1">
        <input
          type="number"
          pattern="[0-9]*"
          name="roomNumber"
          placeholder="5"
          className="w-full px-1 border rounded leading-9 "
        />
        <button
          type="submit"
          className="self-stretch text-xs bg-slate-500 text-white rounded px-2 py-1"
        >
          {fetcher.state === "submitting" ? "Добавление..." : "Добавить"}
        </button>
      </div>
      <div>
        <span>{error && error}</span>
      </div>
    </fetcher.Form>
  );
}
