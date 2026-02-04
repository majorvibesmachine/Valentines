import React, { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { useGlassFill } from '../hooks/useGlassFill';

export const ToastPhase: React.FC = () => {
    const { userId, toastState, updateFill } = useGameContext();

    // Get partner's ID (anyone who isn't me)
    const partnerId = Object.keys(toastState).find(id => id !== userId);

    // My fill logic
    const {
        currentFill: myFill,
        startPouring,
        stopPouring,
        isPouring
    } = useGlassFill({
        updateFill,
        initialFill: toastState[userId] || 0
    });

    // Partner's fill level
    const partnerFill = partnerId ? (toastState[partnerId] || 0) : 0;

    const isFull = myFill >= 100;
    const isOverflowing = myFill > 100;
    const isPartnerFull = partnerFill >= 100;

    // Bartender Reactions (Derived State)
    let bartenderEmoji = '🤵';
    if (isOverflowing) bartenderEmoji = '😱';
    else if (isFull) bartenderEmoji = '👏';
    else if (isPouring) bartenderEmoji = '😲';

    // Haptic
    useEffect(() => {
        if (isPouring && navigator.vibrate) {
            navigator.vibrate(isOverflowing ? 200 : 50);
        }
    }, [isPouring, isOverflowing]);

    return (
        <div className="flex h-[100dvh] w-full flex-col items-center justify-around bg-gradient-to-b from-pink-50 to-pink-100 p-4">

            {/* Bartender Header */}
            <div className="text-center">
                <div className="mb-2 text-6xl animate-bounce duration-1000">
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

                    {/* Glass Container with Mask */}
                    <div className="relative h-64 w-32">
                        {/* The Glass Shape (Border) */}
                        <div className="absolute inset-0 z-10 border-x-4 border-b-8 border-gray-300/50 rounded-b-[3rem] pointer-events-none"></div>

                        {/* The Liquid Mask */}
                        <div className="absolute inset-0 overflow-hidden rounded-b-[2.5rem] bg-white/30 backdrop-blur-sm">
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

                    <button
                        onMouseDown={startPouring}
                        onMouseUp={stopPouring}
                        onMouseLeave={stopPouring}
                        onTouchStart={startPouring}
                        onTouchEnd={stopPouring}
                        className={`rounded-full px-8 py-4 font-bold text-white shadow-lg transition-transform active:scale-90
                            ${isOverflowing ? 'bg-red-500 animate-shake' : 'bg-pink-500'}
                        `}
                    >
                        {isOverflowing ? 'OOPS!' : 'POUR'}
                    </button>
                </div>

                {/* Partner's Glass (Smaller/Simpler) */}
                <div className="flex flex-col items-center gap-2 opacity-80 scale-75">
                    <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Partner</span>
                    <div className="relative h-64 w-32 rounded-b-[3rem] border-4 border-gray-300/30 bg-white/20 overflow-hidden">
                        <div
                            className="absolute bottom-0 w-full bg-pink-400 transition-all duration-300"
                            style={{ height: `${partnerFill}%` }}
                        ></div>
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
        </div>
    );
};
