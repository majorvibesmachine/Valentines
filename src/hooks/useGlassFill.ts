import { useState, useCallback, useRef, useEffect } from 'react';

interface UseGlassFillProps {
    updateFill: (fill: number) => Promise<void>;
    initialFill?: number;
}

export const useGlassFill = ({ updateFill, initialFill = 0 }: UseGlassFillProps) => {
    const [currentFill, setCurrentFill] = useState(initialFill);
    const [isPouring, setIsPouring] = useState(false);
    const requestRef = useRef<number | null>(null);
    const lastUpdateRef = useRef<number>(0);
    const fillRef = useRef(initialFill);

    useEffect(() => {
        if (!isPouring) {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
                // Final update
                updateFill(fillRef.current);
            }
            return;
        }

        const animate = (time: number) => {
            if (fillRef.current >= 100) {
                setIsPouring(false);
                return;
            }

            // Fill speed: ~20% per second
            const increment = 0.4;
            fillRef.current = Math.min(100, fillRef.current + increment);
            setCurrentFill(fillRef.current);

            // Throttle updates
            if (time - lastUpdateRef.current > 200) {
                updateFill(fillRef.current);
                lastUpdateRef.current = time;
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
        };
    }, [isPouring, updateFill]);

    const startPouring = useCallback(() => {
        if (fillRef.current >= 100) return;
        setIsPouring(true);
    }, []);

    const stopPouring = useCallback(() => {
        setIsPouring(false);
    }, []);

    return {
        currentFill,
        isPouring,
        startPouring,
        stopPouring
    };
};
