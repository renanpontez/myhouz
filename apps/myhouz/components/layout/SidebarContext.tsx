"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

const STORAGE_KEY = "myhouz-sidebar-expanded";

interface SidebarState {
  /** Mobile drawer open state */
  isOpen: boolean;
  /** Desktop sidebar expanded state (persisted in localStorage) */
  isExpanded: boolean;
  /** Toggle: on desktop expands/collapses sidebar, on mobile opens/closes drawer */
  toggle: () => void;
  /** Explicitly toggle the desktop expanded state */
  toggleExpanded: () => void;
  /** Close the mobile drawer */
  close: () => void;
}

const SidebarContext = createContext<SidebarState | null>(null);

function getStoredExpanded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return true;
    return stored === "true";
  } catch {
    return true;
  }
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setIsExpanded(getStoredExpanded());
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever isExpanded changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(isExpanded));
    } catch {
      // localStorage may be unavailable
    }
  }, [isExpanded, hydrated]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const toggle = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsExpanded((prev) => !prev);
    } else {
      setIsOpen((prev) => !prev);
    }
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, isExpanded, toggle, toggleExpanded, close }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
