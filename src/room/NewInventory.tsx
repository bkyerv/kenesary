import { Form, Link, LoaderFunctionArgs, redirect } from "react-router-dom";
import { postInventory } from "../api/inventory";
import { useRef } from "react";
import { DateIcon } from "./Transactions";

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const { description, givenDate } = Object.fromEntries(formData);
  console.log(params);
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
    <div className="flex flex-col gap-2 mt-2 ">
      <Form method="post" className="text-sm flex flex-col gap-2">
        <div>
          <label>Название</label>
          <input
            type="text"
            name="description"
            className="border rounded w-full p-1"
          />
        </div>
        <div className="relative">
          <label>Дата выдачи</label>
          <input
            type="date"
            name="givenDate"
            ref={dateRef}
            onFocus={(e) => e.currentTarget.showPicker()}
            className="border rounded w-full p-1"
          />
          <div
            onClick={showDatePicker}
            className="absolute top-6 right-0.5 bg-white rounded-lg"
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
