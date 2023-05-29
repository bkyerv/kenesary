import { ActionFunctionArgs, Form, Link, redirect } from "react-router-dom";
import { addResident } from "../api/resident";
import { useRef } from "react";
import { DateIcon } from "../components/icons/icons";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { residentName, movingInDate } = Object.fromEntries(formData);

  const res = await addResident({
    residentName: residentName as string,
    movingInDate: movingInDate as string,
    roomNumber: params.id as string,
  });
  // console.log(params);
  return redirect(`/rooms/${params.id}/residents`);
}

export default function NewResidentForm() {
  const dateRef = useRef<HTMLInputElement>(null);

  function showDatePicker() {
    if (dateRef.current) {
      dateRef.current.focus();
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-2 text-sm">
      <span className="text-pink-500 text-xs">
        Форма добавления нового жителя
      </span>
      <Form method="post" className="flex flex-col gap-2">
        <div>
          <label className="text-gray-400">Имя жителя</label>
          <input
            type="text"
            name="residentName"
            required
            className="border rounded w-full px-1 leading-9"
          />
        </div>
        <div className="relative">
          <label className="text-gray-400 block">Дата заезда</label>
          <input
            type="date"
            name="movingInDate"
            required
            ref={dateRef}
            onFocus={(e) => e.currentTarget.showPicker()}
            className="border rounded w-full leading-9 px-2"
          />
          <div
            onClick={showDatePicker}
            className="absolute top-7 right-1 bg-white"
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
