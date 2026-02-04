import { useEffect, useRef } from 'react';

export function useAutoSave<T>(key: string, data: T, intervalMs: number = 5000) {
    const dataRef = useRef(data);

    // Keep ref updated
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        const interval = setInterval(() => {
            try {
                localStorage.setItem(key, JSON.stringify(dataRef.current));
                console.log(`[AutoSave] Saved to ${key}`);
            } catch (e) {
                console.error('[AutoSave] Failed', e);
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, [key, intervalMs]);
}
