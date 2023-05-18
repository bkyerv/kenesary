import { supabase } from "./supabase/supabaseClient";
import { ActionFunctionArgs, Form, redirect } from "react-router-dom";

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
    return redirect("/");
  }

  return null;
}

export default function Auth() {
  return (
    <>
      <Form method="post">
        <div>
          <label>email</label>
          <input
            type="email"
            name="email"
            className="border rounded w-full px-2"
          />
        </div>
        <div>
          <label>password</label>
          <input
            type="password"
            name="password"
            className=" px-2 border rounded w-full"
          />
        </div>
        <button>Login</button>
      </Form>
    </>
  );
}
