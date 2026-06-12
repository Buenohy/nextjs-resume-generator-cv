import { useState, useEffect, useRef } from "react";

type Listener = (isOpen: boolean) => void;
const listeners = new Map<string, Set<Listener>>();

// Helper function to subscribe to updates of a specific section
export const subscribeToSection = (id: string, listener: Listener) => {
  if (!listeners.has(id)) {
    listeners.set(id, new Set());
  }
  listeners.get(id)!.add(listener);
  return () => {
    listeners.get(id)?.delete(listener);
    if (listeners.get(id)?.size === 0) {
      listeners.delete(id);
    }
  };
};

// Helper function to publish/broadcast section state changes
export const publishSectionToggle = (id: string, isOpen: boolean) => {
  listeners.get(id)?.forEach((listener) => listener(isOpen));
};

// Custom synchronization hook (closed by default)
export function useSyncCollapse(id: string, initialValue: boolean = false) {
  const [isOpen, setIsOpenState] = useState(initialValue);
  const isExternalChange = useRef(false);

  // 1. Listen for external state changes (Nav -> Form)
  useEffect(() => {
    const unsubscribe = subscribeToSection(id, (nextOpen) => {
      setIsOpenState((prev) => {
        if (prev === nextOpen) return prev;
        isExternalChange.current = true;
        return nextOpen;
      });
    });
    return unsubscribe;
  }, [id]);

  // 2. Publish local updates asynchronously post-render (Form -> Nav)
  useEffect(() => {
    if (isExternalChange.current) {
      isExternalChange.current = false;
      return;
    }
    publishSectionToggle(id, isOpen);
  }, [id, isOpen]);

  return [isOpen, setIsOpenState] as const;
}
