"use client";
import React from 'react';

interface UIOverlayProps {
    onModeChange: (mode: 'TREE' | 'SCATTER' | 'FOCUS_RANDOM') => void;
    onCameraToggle: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isCameraActive: boolean;
    loading: boolean;
}

export default function UIOverlay({ 
    onModeChange, 
    onCameraToggle, 
    onFileChange, 
    isCameraActive,
    loading 
}: UIOverlayProps) {
    if (loading) {
        return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050d1a] text-[#d4af37]">
                <div className="w-10 h-10 border border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mb-4"></div>
                <div className="text-sm tracking-[4px] uppercase font-light">Loading Memories</div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center pt-10">
            {/* Title */}
            <h1 className="text-[8vw] md:text-[56px] font-serif tracking-[6px] text-transparent bg-clip-text bg-linear-to-b from-white to-[#eebb66] drop-shadow-[0_0_50px_rgba(252,238,167,0.6)] text-center opacity-90">
                Merry Christmas
            </h1>

            {/* Controls (Top Right) */}
            <div className="absolute top-24 right-5 flex flex-col items-end gap-2 pointer-events-auto">
                <button 
                    onClick={onCameraToggle}
                    className={`px-5 py-2 border border-[#d4af37]/40 text-[#d4af37] text-[10px] uppercase tracking-widest backdrop-blur-sm transition-all duration-300 min-w-[120px]
                    ${isCameraActive ? 'bg-[#d4af37]/80 text-black shadow-[0_0_15px_rgba(212,175,55,0.6)]' : 'bg-black/60 hover:bg-[#d4af37] hover:text-black'}`}
                >
                    {isCameraActive ? '📷 Gesture Active' : '📷 Enable Gesture'}
                </button>
                
                <label className="px-5 py-2 border border-[#d4af37]/40 bg-black/60 text-[#d4af37] text-[10px] uppercase tracking-widest cursor-pointer hover:bg-[#d4af37] hover:text-black transition-all duration-300 min-w-[120px] text-center backdrop-blur-sm">
                    Add Local Files
                    <input type="file" onChange={onFileChange} multiple accept="image/*" className="hidden" />
                </label>
            </div>

            {/* Mode Buttons (Bottom Center) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
                <ModeBtn icon="🎄" onClick={() => onModeChange('TREE')} label="Tree" />
                <ModeBtn icon="✨" onClick={() => onModeChange('SCATTER')} label="Scatter" />
                <ModeBtn icon="🔍" onClick={() => onModeChange('FOCUS_RANDOM')} label="Focus" />
            </div>

            {/* Debug/Hint Info */}
            <div className="absolute bottom-1 left-0 w-full text-center text-[#d4af37]/60 text-[10px] font-mono">
                Drag to rotate • Tap photo to view
            </div>
        </div>
    );
}

function ModeBtn({ icon, onClick, label }: { icon: string, onClick: () => void, label: string }) {
    return (
        <button 
            onClick={onClick}
            title={label}
            className="w-12 h-12 rounded-full bg-black/60 border border-[#d4af37] text-xl flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90 hover:bg-[#d4af37]/20"
        >
            {icon}
        </button>
    );
}