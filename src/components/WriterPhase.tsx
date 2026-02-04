import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { useAutoSave } from '../hooks/useAutoSave';
import { useDraggable } from '../hooks/useDraggable';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';

// Simple sticker component wrapper
const Sticker: React.FC<{
    emoji: string;
    initialPos: { x: number; y: number };
}> = ({ emoji, initialPos }) => {
    const { position, handlers, isDragging } = useDraggable(initialPos);

    return (
        <div
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                fontSize: '3rem',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none', // Crucial for dragging on touch devices
                zIndex: isDragging ? 50 : 10
            }}
            {...handlers}
        >
            {emoji}
        </div>
    );
};

// Helper for random generation to avoid "pure render" linter issues if any
const createRandomSticker = (emoji: string) => {
    return {
        id: Math.random().toString(36).substr(2, 9),
        emoji,
        x: 50 + Math.random() * 200,
        y: 50 + Math.random() * 200
    };
};

export const WriterPhase: React.FC = () => {
    const { userId, roomId } = useGameContext();

    // Letter State
    const [letterContent, setLetterContent] = useState(() => {
        const saved = localStorage.getItem(roomId ? `draft_${roomId}_${userId}` : 'draft_temp');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (typeof parsed === 'string') return parsed;
                return parsed.content || '';
            } catch {
                return '';
            }
        }
        return '';
    });

    const [stickers, setStickers] = useState<{ id: string; emoji: string; x: number; y: number }[]>(() => {
        const saved = localStorage.getItem(roomId ? `draft_${roomId}_${userId}` : 'draft_temp');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (typeof parsed !== 'string' && parsed.stickers) return parsed.stickers;
            } catch {
                return [];
            }
        }
        return [];
    });

    // Auto-save key logic
    const saveKey = roomId ? `draft_${roomId}_${userId}` : 'draft_temp';

    // Auto-save hook
    useAutoSave(saveKey, { content: letterContent, stickers }, 5000);

    const handleAddSticker = (emoji: string) => {
        setStickers(prev => [...prev, createRandomSticker(emoji)]);
    };

    const handleLockIn = async () => {
        if (!roomId || !userId) return;

        try {
            // Save letter to Firebase
            await set(ref(db, `letters/${roomId}/${userId}`), {
                content: letterContent,
                stickers: stickers, // Note: storing absolute positions might need refinement for different screens, but sticking to "Skeleton"
                timestamp: Date.now()
            });

            // Save status to room (optional, depending on flow, but useful for tracking)
            await set(ref(db, `rooms/${roomId}/status/${userId}`), 'READY');

            // Move to next phase (In a real game, might wait for partner, but for now we can trigger it)
            // Strategy: wait for a listener in GameContext or just manual trigger?
            // Spec says "Lock In", let's just save for now.
            // The prompt says "Build the letter writer... Save data to /letters".
            // Phase transition logic might be separate or triggered here if both are ready.
            // For this block, we will just save and maybe show a "Waiting..." state.

            alert("Letter locked in! Waiting for partner...");

        } catch (e) {
            console.error("Error locking in:", e);
            alert("Failed to save letter. Please try again.");
        }
    };

    // available stickers
    const availableStickers = ['❤️', '💌', '🌹', '🍫', '🧸', '💋'];

    return (
        <div className="flex flex-col h-[100dvh] w-full items-center bg-purple-100 overflow-hidden relative">

            {/* Header */}
            <div className="w-full p-4 bg-purple-600 text-white shadow-md z-20 flex justify-between items-center">
                <h1 className="text-xl font-bold font-mono">Ghost Writer</h1>
                <button
                    onClick={handleLockIn}
                    className="bg-white text-purple-600 px-4 py-2 rounded font-bold hover:bg-purple-50 transition"
                >
                    Lock In 🔒
                </button>
            </div>

            {/* Sticker Toolbar */}
            <div className="w-full p-2 bg-purple-200 flex justify-center gap-4 z-20 overflow-x-auto">
                {availableStickers.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => handleAddSticker(emoji)}
                        className="text-3xl hover:scale-110 transition transform"
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            {/* Main "Desk" Area */}
            <div className="flex-1 w-full max-w-2xl relative p-4 flex flex-col items-center justify-center">

                {/* The Paper */}
                <div
                    className="bg-[#fdfbf7] w-full h-[70vh] shadow-2xl p-8 relative overflow-hidden"
                    style={{
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 98%, 98% 100%, 0% 100%)' // Subtle torn edge effect? Just simple for now.
                    }}
                >
                    <textarea
                        className="w-full h-full bg-transparent resize-none border-none outline-none font-mono text-lg leading-loose text-gray-800"
                        placeholder="Dearest..."
                        value={letterContent}
                        onChange={(e) => setLetterContent(e.target.value)}
                        style={{
                            backgroundImage: 'linear-gradient(transparent, transparent 29px, #e5e7eb 30px)',
                            backgroundSize: '100% 30px',
                            lineHeight: '30px'
                        }}
                    />

                    {/* Stickers Layer inside the paper container so they clip */}
                    {stickers.map(s => (
                        <Sticker
                            key={s.id}
                            emoji={s.emoji}
                            initialPos={{ x: s.x, y: s.y }}
                        />
                    ))}
                </div>
            </div>

            {/* Debug Info (temporary) */}
            <div className="absolute bottom-1 left-1 text-xs text-gray-400 pointer-events-none">
                Auto-saving to {saveKey}
            </div>
        </div>
    );
};
