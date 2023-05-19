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
      room_number: parseInt(roomNumber),
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

export async function deleteResident(id: string) {
  const { data, error } = await supabase.from("resident").delete().eq("id", id);
  if (error) {
    throw {
      message: error.message,
      status: 500,
    };
  }

  return data;
}

export async function editResident(values: {
  residentName: string;
  movingIn: string;
  id: string;
}) {
  const { data, error } = await supabase
    .from("resident")
    .update({
      resident_name: values.residentName as string,
      moving_in: values.movingIn as string,
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
