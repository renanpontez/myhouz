"use server";

// TODO: Implement items to buy server actions
// - createItem
// - updateItem
// - deleteItem
// - markItemDone
// - changeItemStatus

export async function createItem(
  _householdId: string,
  _formData: FormData,
) {
  throw new Error("Not implemented");
}

export async function updateItem(
  _householdId: string,
  _itemId: string,
  _formData: FormData,
) {
  throw new Error("Not implemented");
}

export async function deleteItem(
  _householdId: string,
  _itemId: string,
) {
  throw new Error("Not implemented");
}

export async function markItemDone(
  _householdId: string,
  _itemId: string,
) {
  throw new Error("Not implemented");
}

export async function changeItemStatus(
  _householdId: string,
  _itemId: string,
  _status: string,
) {
  throw new Error("Not implemented");
}
