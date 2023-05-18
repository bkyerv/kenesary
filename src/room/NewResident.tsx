import { ActionFunctionArgs, Form, Link, redirect } from "react-router-dom";
import { addResident } from "../api/resident";

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
  return (
    <div className="flex flex-col gap-2 mt-2 ">
      <div className="text-left ">
        <Link to="../residents">
          <button className="underline text-blue-500">&larr; Назад</button>
        </Link>
      </div>
      <Form method="post" className="flex flex-col gap-2">
        <div>
          <label>resident name</label>
          <input
            type="text"
            name="residentName"
            className="border rounded w-full leading-9 px-2"
          />
        </div>
        <div>
          <label>date of moving in</label>
          <input
            type="date"
            name="movingInDate"
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
