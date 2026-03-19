import type { PluginEventBus } from './PluginInterface';

type Handler = (data?: unknown) => void;

export function createEventBus(): PluginEventBus {
  const listeners = new Map<string, Set<Handler>>();

  return {
    emit(event: string, data?: unknown) {
      const handlers = listeners.get(event);
      if (!handlers) return;
      handlers.forEach((h) => {
        try {
          h(data);
        } catch {}
      });
    },

    on(event: string, handler: Handler) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(handler);
      return () => {
        listeners.get(event)?.delete(handler);
        if (listeners.get(event)?.size === 0) {
          listeners.delete(event);
        }
      };
    },
  };
}
