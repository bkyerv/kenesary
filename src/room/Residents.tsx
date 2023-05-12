import { useState } from "react";
import { Link } from "react-router-dom";

const residents = [
  {
    id: "1",
    name: "Иванов Иван Иванович",
  },
  {
    id: "2",
    name: "Michale Johnson",
  },
  {
    id: "3",
    name: "Vikram Singh",
  },
];
export default function Residents() {
  const [showAddResidentForm, setShowAddResidentForm] = useState(false);
  return showAddResidentForm ? (
    <>
      <div className="py-4 text-right">
        <button
          onClick={() => setShowAddResidentForm(false)}
          className="rounded  text-blue-500 px-2 py-1 shadow-sm outline outline-2 outline-blue-500"
        >
          back to the list
        </button>
      </div>
      <form className="text-right space-y-2 shadow-md bg-slate-50 p-4">
        <div className="flex gap-2 items-center justify-center">
          <label>first name</label>
          <input type="text" className="w-full border rounded leading-9" />
        </div>
        <div className="flex gap-2 items-center justify-center">
          <label>last name</label>
          <input type="text" className="w-full border rounded leading-9" />
        </div>

        <button className="px-4 py-1 rounded bg-blue-500 text-white">
          Add
        </button>
      </form>
    </>
  ) : (
    <>
      <div className="py-4 text-right">
        <button
          onClick={() => setShowAddResidentForm(true)}
          className="rounded  text-blue-500 px-2 py-1 shadow-sm outline outline-2 outline-blue-500"
        >
          +resident
        </button>
      </div>
      {residents.map((item) => (
        <Link to={`./${item.id}`} key={item.id} className="block">
          {item.name}
        </Link>
      ))}
    </>
  );
}
