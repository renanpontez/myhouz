"use server";

// TODO: Implement member management server actions
// - changeRole
// - removeMember
// - leaveHousehold

export async function changeRole(
  _householdId: string,
  _memberId: string,
  _role: string,
) {
  throw new Error("Not implemented");
}

export async function removeMember(
  _householdId: string,
  _memberId: string,
) {
  throw new Error("Not implemented");
}

export async function leaveHousehold(_householdId: string) {
  throw new Error("Not implemented");
}
