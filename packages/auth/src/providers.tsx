"use client";

import { createContext, useContext, type ReactNode } from "react";
import type {
  Profile,
  Household,
  HouseholdMember,
  MemberRole,
} from "@home/types";

// ---- UserProvider ----

interface UserHousehold {
  id: string;
  name: string;
  role: MemberRole;
}

interface UserContextValue {
  user: Profile;
  households: UserHousehold[];
}

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  user: Profile;
  households?: UserHousehold[];
  children: ReactNode;
}

export function UserProvider({ user, households = [], children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user, households }}>{children}</UserContext.Provider>
  );
}

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

// ---- HouseholdProvider ----

interface HouseholdContextValue {
  household: Household;
  membership: HouseholdMember;
  role: MemberRole;
  members: Profile[];
  isOwner: boolean;
}

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

interface HouseholdProviderProps {
  household: Household;
  membership: HouseholdMember;
  role: MemberRole;
  members: Profile[];
  children: ReactNode;
}

export function HouseholdProvider({
  household,
  membership,
  role,
  members,
  children,
}: HouseholdProviderProps) {
  return (
    <HouseholdContext.Provider
      value={{
        household,
        membership,
        role,
        members,
        isOwner: role === "owner",
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHouseholdContext(): HouseholdContextValue {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error(
      "useHouseholdContext must be used within a HouseholdProvider",
    );
  }
  return context;
}
