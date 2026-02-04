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
            // Allow overfill (spilling) up to 130%
            if (fillRef.current >= 130) {
                // Spilled! Reset.
                setIsPouring(false);
                fillRef.current = 0;
                setCurrentFill(0);
                updateFill(0);
                return;
            }

            // Fill speed: ~20% per second
            // Add initial burst for immediate feedback
            const baseIncrement = 0.4;
            const increment = fillRef.current < 5 ? 1.5 : baseIncrement;

            fillRef.current = fillRef.current + increment;
            setCurrentFill(fillRef.current);

            // Throttle updates
            if (time - lastUpdateRef.current > 200) {
                updateFill(Math.min(100, fillRef.current)); // Only sync up to 100 to partner
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
