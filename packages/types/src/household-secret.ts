// Post-MVP: HouseholdSecret types

export type SecretCategory = "password" | "contact" | "code" | "other";

export interface HouseholdSecret {
  id: string;
  household_id: string;
  title: string;
  category: SecretCategory;
  value: string;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
