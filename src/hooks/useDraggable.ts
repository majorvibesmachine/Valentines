import { useState, useRef, useEffect, useCallback } from 'react';

interface Position {
    x: number;
    y: number;
}

export function useDraggable(initialPosition: Position = { x: 0, y: 0 }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const initialPosRef = useRef<Position>(initialPosition);

    const handleStart = useCallback((clientX: number, clientY: number) => {
        setIsDragging(true);
        dragStartRef.current = { x: clientX, y: clientY };
        initialPosRef.current = position;
    }, [position]);

    const handleMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging || !dragStartRef.current) return;

        const deltaX = clientX - dragStartRef.current.x;
        const deltaY = clientY - dragStartRef.current.y;

        setPosition({
            x: initialPosRef.current.x + deltaX,
            y: initialPosRef.current.y + deltaY,
        });
    }, [isDragging]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
        dragStartRef.current = null;
    }, []);

    // Mouse events
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault(); // Prevent text selection
        handleStart(e.clientX, e.clientY);
    }, [handleStart]);

    // Touch events
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        // Don't prevent default here to allow scrolling if needed, 
        // but often for drag items we might want to.
        // For now, let's just grab coordinates.
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
    }, [handleStart]);

    // Global move/up listeners to handle dragging outside the element
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const onMouseUp = () => handleEnd();

        const onTouchMove = (e: TouchEvent) => {
            if (isDragging) {
                e.preventDefault(); // Prevent scrolling while dragging
                const touch = e.touches[0];
                handleMove(touch.clientX, touch.clientY);
            }
        };
        const onTouchEnd = () => handleEnd();

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging, handleMove, handleEnd]);

    return {
        position,
        isDragging,
        handlers: {
            onMouseDown,
            onTouchStart
        }
    };
}
