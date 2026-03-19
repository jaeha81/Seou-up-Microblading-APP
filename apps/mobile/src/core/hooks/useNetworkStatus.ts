import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type NetworkStatus = 'online' | 'offline' | 'unknown';

const PING_URL = 'https://clients3.google.com/generate_204';
const CHECK_INTERVAL = 30_000;

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>('unknown');
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const check = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch(PING_URL, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setStatus('online');
    } catch {
      setStatus('offline');
    }
  };

  useEffect(() => {
    check();
    timer.current = setInterval(check, CHECK_INTERVAL);

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') check();
    });

    return () => {
      if (timer.current) clearInterval(timer.current);
      sub.remove();
    };
  }, []);

  return status;
}
