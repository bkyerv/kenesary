import { supabase } from "../supabase/supabaseClient";

export async function addTransaction(
  amount: string,
  date: string,
  note: string,
  month: string,
  room_number: string
) {
  await supabase.from("transaction").upsert({
    amount,
    note,
    date,
    month,
    room_number,
  });
}

export async function getTransactions(room_number: string) {
  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .eq("room_number", room_number);
  if (error) {
    throw {
      message: error.message,
      status: 500,
    };
  }

  return data;
}
