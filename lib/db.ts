export type Record = {
  id: number;
  user_email: string;
  title: string;
  priority: "low" | "med" | "high";
  created_at: Date;
};

let records: Record[] = [];
let idCounter = 1;

export function addRecord(user_email: string, title: string, priority: "low" | "med" | "high") {
  const record: Record = {
    id: idCounter++,
    user_email,
    title,
    priority,
    created_at: new Date(),
  };
  records.push(record);
  return record;
}

export function getRecordsByUser(email: string) {
  return records.filter(record => record.user_email === email);
}