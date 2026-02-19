// Post-MVP: Bill types

export type BillStatus = "unpaid" | "paid" | "overdue" | "cancelled";
export type BillRecurrence =
  | "one_off"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export interface Bill {
  id: string;
  household_id: string;
  title: string;
  amount: number;
  currency: string;
  due_at: string;
  status: BillStatus;
  recurrence: BillRecurrence;
  created_by: string;
  assigned_to: string | null;
  paid_at: string | null;
  paid_by: string | null;
  created_at: string;
  updated_at: string;
}
