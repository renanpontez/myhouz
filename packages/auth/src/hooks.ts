"use client";

import { useUserContext, useHouseholdContext } from "./providers";

export function useUser() {
  const { user } = useUserContext();
  return user;
}

export function useUserHouseholds() {
  const { households } = useUserContext();
  return households;
}

export function useHousehold() {
  const context = useHouseholdContext();
  return context;
}
