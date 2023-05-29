import { supabase } from "../supabase/supabaseClient";

export async function addTransaction(
  amount: string,
  date: string,
  note: string,
  month: string,
  paymentType: string,
  room_number: string
) {
  await supabase.from("transaction").upsert({
    amount: parseInt(amount),
    note,
    date,
    month,
    payment_type: paymentType,
    room_number: parseInt(room_number),
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

export async function deleteTransaction(id: string) {
  const { data, error } = await supabase
    .from("transaction")
    .delete()
    .eq("id", id);

  if (error) {
    throw {
      message: error.message,
      status: 500,
    };
  }

  return data;
}

export async function markMonthAsSettled(room_number: string, month: string) {
  await supabase.from("debt").insert([
    {
      room_number: parseInt(room_number),
      settled_period: month,
    },
  ]);
}
