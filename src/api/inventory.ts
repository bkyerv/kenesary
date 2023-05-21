import { supabase } from "../supabase/supabaseClient";
import { requireAuth } from "../utils/requireAuth";

export async function fetchInventory(id: string | undefined) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("room_number", id);

  if (error) {
    throw {
      status: 500,
      message: error,
    };
  }

  return data;
}

export async function postInventory({
  description,
  givenDate,
  roomNumber,
}: any) {
  return await supabase.from("inventory").insert([
    {
      description,
      given_date: givenDate,
      room_number: roomNumber,
    },
  ]);
}

export async function deleteIventory(id: string) {
  await supabase.from("inventory").delete().eq("id", id);
}

export async function editInventory(values: any) {
  const { data, error } = await supabase
    .from("inventory")
    .update({
      description: values.residentName as string,
      given_date: values.movingIn as string,
    })
    .eq("id", values.id);

  if (error) {
    throw {
      message: error.message,
      status: 500,
    };
  }

  return data;
}
