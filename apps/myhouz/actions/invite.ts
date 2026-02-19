"use server";

// TODO: Implement invite management server actions
// - generateInvite
// - revokeInvite
// - acceptInvite

export async function generateInvite(
  _householdId: string,
  _formData: FormData,
) {
  throw new Error("Not implemented");
}

export async function revokeInvite(
  _householdId: string,
  _inviteId: string,
) {
  throw new Error("Not implemented");
}

export async function acceptInvite(_code: string) {
  throw new Error("Not implemented");
}
