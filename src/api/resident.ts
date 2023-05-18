import { supabase } from "../supabase/supabaseClient";

export async function getResidents(roomNumber: string) {
  const { data, error } = await supabase
    .from("resident")
    .select("*")
    .eq("room_number", roomNumber);

  if (error) {
    throw {
      message: error.message,
      status: 500,
    };
  }

  return data;
}

export async function addResident({
  residentName,
  movingInDate,
  roomNumber,
}: {
  residentName: string;
  movingInDate: string;
  roomNumber: string;
}) {
  const { data, error } = await supabase.from("resident").insert([
    {
      resident_name: residentName,
      moving_in: movingInDate,
      room_number: roomNumber,
    },
  ]);

  if (error) {
    throw {
      message: error.message,
      status: 500,
    };
  }

  return data;
}
