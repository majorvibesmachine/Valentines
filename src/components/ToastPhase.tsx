import React, { useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { useGlassFill } from '../hooks/useGlassFill';
import { GamePhase } from '../types';

export const ToastPhase: React.FC = () => {
    const { userId, toastState, penaltyState, updateFill, updatePenaltyState, setPhase } = useGameContext();

    // Get partner's ID (anyone who isn't me)
    const partnerId = Object.keys(toastState).find(id => id !== userId);

    // My fill logic
    const {
        currentFill: myFill,
        startPouring,
        stopPouring,
        resetFill,
        isPouring
    } = useGlassFill({
        updateFill,
        initialFill: toastState[userId] || 0
    });

    // Partner's fill level
    const partnerFill = partnerId ? (toastState[partnerId] || 0) : 0;

    const isFull = myFill >= 95 && myFill <= 100; // More forgiving threshold
    const isOverflowing = myFill > 100;
    const isPartnerFull = partnerFill >= 95 && partnerFill <= 100; // More forgiving threshold

    // One-shot pour mechanic state
    const [hasPoured, setHasPoured] = useState(false);
    const [showAngryWaiter, setShowAngryWaiter] = useState(false);
    const myPenalty = penaltyState[userId] || false;
    const partnerPenalty = partnerId ? (penaltyState[partnerId] || false) : false;

    // Bartender Emoji Cycling
    const emojiSets = {
        idle: ['🤵', '🧑\u200d🍳', '👨\u200d🍳'],
        pouring: ['😲', '😮', '👀'],
        full: ['👏', '🎉', '✨'],
        overflow: ['😱', '😰', '🫣'],
        angry: ['😡', '😠', '💢']
    };

    const getCurrentEmojiSet = () => {
        if (showAngryWaiter || myPenalty || partnerPenalty) return emojiSets.angry;
        if (isOverflowing) return emojiSets.overflow;
        if (isFull) return emojiSets.full;
        if (isPouring) return emojiSets.pouring;
        return emojiSets.idle;
    };

    const [emojiIndex, setEmojiIndex] = useState(0);
    const [currentEmojiSet, setCurrentEmojiSet] = useState(getCurrentEmojiSet());

    // Cycle through emojis
    useEffect(() => {
        const newSet = getCurrentEmojiSet();
        if (newSet !== currentEmojiSet) {
            setCurrentEmojiSet(newSet);
            setEmojiIndex(0);
        }

        const interval = setInterval(() => {
            setEmojiIndex(prev => (prev + 1) % currentEmojiSet.length);
        }, 800);

        return () => clearInterval(interval);
    }, [isPouring, isFull, isOverflowing, showAngryWaiter, myPenalty, partnerPenalty]);

    const bartenderEmoji = currentEmojiSet[emojiIndex];

    // Haptic
    useEffect(() => {
        if (isPouring && navigator.vibrate) {
            navigator.vibrate(isOverflowing ? 200 : 50);
        }
    }, [isPouring, isOverflowing]);

    // Auto-progress to next phase when both players are full
    useEffect(() => {
        const isPartnerOverflowing = partnerFill > 100;

        if (isFull && isPartnerFull && !isOverflowing && !isPartnerOverflowing) {
            const timer = setTimeout(() => {
                setPhase(GamePhase.WRITER);
            }, 2000); // Wait 2 seconds to show success overlay

            return () => clearTimeout(timer);
        }
    }, [isFull, isPartnerFull, isOverflowing, setPhase, myFill, partnerFill]);

    // Handle pour start - only allow if haven't poured yet and not penalized
    const handleStartPour = () => {
        if (hasPoured || myPenalty) return;
        setHasPoured(true);
        startPouring();
    };

    // Handle pour stop - check for early release penalty
    const handleStopPour = () => {
        stopPouring();

        // If released before reaching 95% (and not already overflowing), trigger penalty
        if (hasPoured && myFill < 95 && !isOverflowing) {
            triggerPenalty();
        }
    };

    // Trigger penalty: angry waiter, reset both glasses
    const triggerPenalty = () => {
        setShowAngryWaiter(true);
        resetFill();
        updatePenaltyState(true);

        // Hide angry waiter after 2 seconds
        setTimeout(() => setShowAngryWaiter(false), 2000);
    };

    // Reset when partner gets penalized
    useEffect(() => {
        if (partnerPenalty && !myPenalty) {
            resetFill();
            setHasPoured(false);
        }
    }, [partnerPenalty, myPenalty, resetFill]);

    return (
        <div className="flex h-[100dvh] w-full flex-col items-center justify-around bg-gradient-to-b from-pink-50 to-pink-100 p-4">

            {/* Bartender Header */}
            <div className="text-center">
                <div className="mb-2 text-6xl" style={{ animation: 'bartender-sway 2s ease-in-out infinite' }}>
                    {bartenderEmoji}
                </div>
                <h1 className="text-2xl font-bold text-pink-600">
                    {isOverflowing ? "Watch out!!" : isFull ? "Perfect Pour!" : "Fill it up!"}
                </h1>
                <p className="text-sm text-pink-400">
                    {isOverflowing ? "Too much!" : "Hold to pour"}
                </p>
            </div>

            <div className="flex w-full max-w-md items-end justify-center gap-8">
                {/* My Glass */}
                <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-pink-500">You</span>

                    {/* Champagne Glass Container */}
                    <div className="relative flex flex-col items-center">
                        {/* Glass Bowl (Flute Shape) */}
                        <div className="relative h-64 w-24" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 75% 100%, 25% 100%)' }}>
                            {/* Glass Border */}
                            <div className="absolute inset-0 z-10 border-x-4 border-t-4 border-gray-300/50 pointer-events-none" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 75% 100%, 25% 100%)' }}></div>

                            {/* Liquid Mask */}
                            <div className="absolute inset-0 overflow-hidden bg-white/30 backdrop-blur-sm">
                                <div
                                    className={`absolute bottom-0 w-full transition-all duration-75 ease-linear
                                        ${isOverflowing ? 'bg-red-500' : isFull ? 'bg-green-400' : 'bg-pink-500'}
                                    `}
                                    style={{ height: `${Math.min(100, myFill)}%` }}
                                >
                                    {/* Surface Tension / Wave */}
                                    <div className="absolute -top-2 h-4 w-full bg-white/20 blur-sm rounded-[100%]"></div>

                                    {/* Bubbles */}
                                    {isPouring && (
                                        <div className="absolute inset-0 animate-pulse bg-white/10">
                                            <div className="absolute bottom-0 left-1/4 h-4 w-4 rounded-full bg-white/40 animate-bounce"></div>
                                            <div className="absolute bottom-4 right-1/4 h-3 w-3 rounded-full bg-white/30 animate-ping"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Overflow Spill Effect */}
                            {isOverflowing && (
                                <div className="absolute -right-4 top-0 h-full w-2 bg-red-400 blur-md animate-pulse"></div>
                            )}
                        </div>

                        {/* Stem */}
                        <div className="w-2 h-12 bg-gradient-to-b from-gray-300/50 to-gray-400/50"></div>

                        {/* Base */}
                        <div className="w-16 h-2 rounded-full bg-gray-400/50"></div>
                    </div>

                    <button
                        onMouseDown={isOverflowing ? undefined : handleStartPour}
                        onMouseUp={handleStopPour}
                        onMouseLeave={handleStopPour}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            if (isOverflowing) return;
                            handleStartPour();
                        }}
                        onTouchEnd={handleStopPour}
                        onClick={isOverflowing ? resetFill : undefined}
                        disabled={hasPoured && !isOverflowing}
                        className={`rounded-full px-8 py-4 font-bold text-white shadow-lg transition-transform active:scale-90 select-none touch-none
                            ${isOverflowing ? 'bg-red-500 animate-pulse' : hasPoured || myPenalty ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500'}
                        `}
                    >
                        {isOverflowing ? 'OOPS!' : hasPoured || myPenalty ? 'POURED' : 'POUR'}
                    </button>
                </div>

                {/* Partner's Glass (Champagne Flute) */}
                <div className="flex flex-col items-center gap-2 opacity-80 scale-75">
                    <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Partner</span>

                    {/* Champagne Glass Container */}
                    <div className="relative flex flex-col items-center">
                        {/* Glass Bowl (Flute Shape) */}
                        <div className="relative h-64 w-24" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 75% 100%, 25% 100%)' }}>
                            {/* Glass Border */}
                            <div className="absolute inset-0 z-10 border-x-4 border-t-4 border-gray-300/30 pointer-events-none" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 75% 100%, 25% 100%)' }}></div>

                            {/* Liquid Mask */}
                            <div className="absolute inset-0 overflow-hidden bg-white/20 backdrop-blur-sm">
                                <div
                                    className="absolute bottom-0 w-full bg-pink-400 transition-all duration-300"
                                    style={{ height: `${Math.min(100, partnerFill)}%` }}
                                >
                                    {/* Surface Tension / Wave */}
                                    <div className="absolute -top-2 h-4 w-full bg-white/10 blur-sm rounded-[100%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Stem */}
                        <div className="w-2 h-12 bg-gradient-to-b from-gray-300/30 to-gray-400/30"></div>

                        {/* Base */}
                        <div className="w-16 h-2 rounded-full bg-gray-400/30"></div>
                    </div>

                    {isPartnerFull && <div className="text-2xl animate-bounce">✅</div>}
                </div>
            </div>

            {/* Success Overlay */}
            {isFull && isPartnerFull && !isOverflowing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="animate-in zoom-in slide-in-from-bottom-10 relative rounded-2xl bg-white p-8 text-center shadow-2xl">
                        <div className="text-8xl animate-bounce">🥂</div>
                        <h2 className="mt-4 text-4xl font-bold text-pink-600">CHEERS!</h2>
                        <p className="mt-2 text-lg text-gray-600">Perfect Synchronization</p>
                    </div>
                </div>
            )}

            {/* Angry Waiter Penalty Overlay */}
            {showAngryWaiter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="animate-in zoom-in slide-in-from-bottom-10 relative rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 p-8 text-center shadow-2xl">
                        <div className="text-9xl animate-bounce">{bartenderEmoji}</div>
                        <h2 className="mt-4 text-4xl font-bold text-white drop-shadow-lg">Don't lift your finger!</h2>
                        <p className="mt-2 text-lg text-white/90">Both glasses reset. Try again!</p>
                    </div>
                </div>
            )}
        </div>
    );
};
