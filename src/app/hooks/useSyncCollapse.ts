import { useState, useEffect, useRef } from "react";

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

// --- O CUSTOM HOOK CORRIGIDO ---
export function useSyncCollapse(id: string, initialValue: boolean = true) {
  const [isOpen, setIsOpenState] = useState(initialValue);
  const isExternalChange = useRef(false);

  // 1. Escuta mudanças vindas de fora (Nav -> Form)
  useEffect(() => {
    const unsubscribe = subscribeToSection(id, (nextOpen) => {
      isExternalChange.current = true;
      setIsOpenState(nextOpen);
    });
    return unsubscribe;
  }, [id]);

  // 2. Publica mudanças locais de forma assíncrona pós-render (Form -> Nav)
  useEffect(() => {
    if (isExternalChange.current) {
      isExternalChange.current = false;
      return;
    }
    publishSectionToggle(id, isOpen);
  }, [id, isOpen]);

  return [isOpen, setIsOpenState] as const;
}
