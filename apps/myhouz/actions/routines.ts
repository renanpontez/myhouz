"use server";

// TODO: Implement routine checklist server actions
// - createChecklist
// - updateChecklist
// - deleteChecklist
// - toggleChecklistItem
// - addChecklistItem
// - removeChecklistItem

export async function createChecklist(
  _householdId: string,
  _formData: FormData,
) {
  throw new Error("Not implemented");
}

export async function updateChecklist(
  _householdId: string,
  _checklistId: string,
  _formData: FormData,
) {
  throw new Error("Not implemented");
}

export async function deleteChecklist(
  _householdId: string,
  _checklistId: string,
) {
  throw new Error("Not implemented");
}

export async function toggleChecklistItem(_itemId: string) {
  throw new Error("Not implemented");
}

export async function addChecklistItem(
  _checklistId: string,
  _formData: FormData,
) {
  throw new Error("Not implemented");
}

export async function removeChecklistItem(
  _checklistId: string,
  _itemId: string,
) {
  throw new Error("Not implemented");
}
