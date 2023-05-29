import { supabase } from "./supabase/supabaseClient";
import { ActionFunctionArgs, Form, Link, redirect } from "react-router-dom";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const { email, password } = Object.fromEntries(formData) as {
    email: string;
    password: string;
  };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data) {
    return redirect("/rooms");
  }

  return null;
}

export default function Auth() {
  return (
    <div className="max-w-xs mx-auto px-2 h-screen flex flex-col text-slate-700">
      <div className="pt-12">
        {/* <Link
          to=".."
          className="mb-4 block text-blue-500 underline text-sm font-light"
        >
          Назад на главную
        </Link> */}
        <Form method="post" className=" px-8 border py-4 flex flex-col gap-4">
          <div>
            <label>email</label>
            <input
              type="email"
              name="email"
              className="border py-1 rounded w-full px-2"
            />
          </div>
          <div>
            <label>password</label>
            <input
              type="password"
              name="password"
              className="py-1 px-2 border rounded w-full"
            />
          </div>
          <div className="text-right">
            <button className="bg-blue-400 text-white px-3 py-1 rounded">
              Войти
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
