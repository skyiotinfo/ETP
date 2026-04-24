import { SUPABASE_KEY, SUPABASE_URL } from "../config";

export interface MotorRecord {
  state: number;
  updatedAt: string;   // ISO timestamp from DB
}

export const fetchMotorData = async (): Promise<Record<string, MotorRecord>> => {
  const res = await fetch(SUPABASE_URL, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  const json = await res.json();

  const result: Record<string, MotorRecord> = {};
  json.forEach((item: any) => {
    result[item.motor_id] = {
      state: item.motor_state,
      updatedAt: item.updated_at,   // from your table's timestamp column
    };
  });

  return result;
};