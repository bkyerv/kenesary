import { Form, Link, LoaderFunctionArgs, redirect } from "react-router-dom";
import { postInventory } from "../api/inventory";
import { useRef } from "react";
import { DateIcon } from "./Transactions";

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const { description, givenDate } = Object.fromEntries(formData);
  await postInventory({ description, givenDate, roomNumber: params.id });
  return redirect("/rooms/" + params.id);
}

export default function InventoryForm() {
  const dateRef = useRef<HTMLInputElement>(null);

  function showDatePicker() {
    if (dateRef.current) {
      dateRef.current.focus();
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-2 text-sm">
      <span className="text-pink-500 text-xs">
        Форма добавления нового инвентария
      </span>
      <Form method="post" className="text-sm flex flex-col gap-2">
        <div>
          <label className="text-gray-400">Название</label>
          <input
            type="text"
            name="description"
            required
            className="border rounded w-full px-1 leading-9"
          />
        </div>
        <div className="relative">
          <label className="text-gray-400 block">Дата выдачи</label>
          <input
            type="date"
            name="givenDate"
            required
            ref={dateRef}
            onFocus={(e) => e.currentTarget.showPicker()}
            className="border rounded w-full leading-9 px-1"
          />
          <div
            onClick={showDatePicker}
            className="absolute top-7 right-1 bg-white rounded-lg"
          >
            <DateIcon />
          </div>
        </div>
        <div className="text-right">
          <button className="bg-blue-500 text-blue-50 px-3 py-1 rounded">
            Добавить
          </button>
        </div>
      </Form>
    </div>
  );
}
