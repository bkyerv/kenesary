import { Form, Link, LoaderFunctionArgs, redirect } from "react-router-dom";
import { postInventory } from "../api/inventory";

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const { description, givenDate } = Object.fromEntries(formData);
  console.log(params);
  await postInventory({ description, givenDate, roomNumber: params.id });
  return redirect("/rooms/" + params.id);
}

export default function InventoryForm() {
  return (
    <div className="flex flex-col gap-2 mt-2 ">
      <div className="text-left ">
        <Link to="..">
          <button className="underline text-blue-500">&larr; Назад</button>
        </Link>
      </div>
      <Form method="post" className="flex flex-col gap-2">
        <div>
          <label>inventory name</label>
          <input
            type="text"
            name="description"
            className="border rounded w-full leading-9 px-2"
          />
        </div>
        <div>
          <label>date of transfer</label>
          <input
            type="date"
            name="givenDate"
            className="border rounded w-full leading-9 px-2"
          />
        </div>
        <div className="text-right">
          <button className="bg-blue-500 text-blue-50 px-3 py-1 rounded">
            add
          </button>
        </div>
      </Form>
    </div>
  );
}
