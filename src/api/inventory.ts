import { supabase } from "../supabase/supabaseClient";

export async function fetchInventory(id: string | undefined) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("room_number", id);

  if (error) {
    throw {
      status: 500,
      message: error.message,
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
