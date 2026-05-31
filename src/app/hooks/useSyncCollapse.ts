import { useState, useEffect, useCallback } from "react";

type Listener = (isOpen: boolean) => void;
const listeners = new Map<string, Set<Listener>>();

// Função auxiliar para assinar atualizações de uma seção
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

// Função auxiliar para publicar que uma seção mudou de estado
export const publishSectionToggle = (id: string, isOpen: boolean) => {
  listeners.get(id)?.forEach((listener) => listener(isOpen));
};

// --- O CUSTOM HOOK ---
export function useSyncCollapse(id: string, initialValue: boolean = true) {
  const [isOpen, setIsOpenState] = useState(initialValue);

  // Escuta se o Índice (SectionNav) mandou abrir/fechar este ID
  useEffect(() => {
    const unsubscribe = subscribeToSection(id, (nextOpen) => {
      setIsOpenState(nextOpen);
    });
    return unsubscribe;
  }, [id]);

  // Atualiza o estado local e avisa o Índice (SectionNav) sobre a mudança
  const setIsOpen = useCallback(
    (nextOpen: boolean | ((prev: boolean) => boolean)) => {
      setIsOpenState((prev) => {
        const resolved =
          typeof nextOpen === "function" ? nextOpen(prev) : nextOpen;
        publishSectionToggle(id, resolved);
        return resolved;
      });
    },
    [id]
  );

  return [isOpen, setIsOpen] as const;
}
