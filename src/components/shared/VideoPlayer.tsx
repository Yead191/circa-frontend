'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Loader2,
    RotateCcw,
} from 'lucide-react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    className?: string;
    /** Fill the parent height and drop the player's own rounded border/shadow (for embedding inside a carousel slide). */
    fill?: boolean;
    /** When false, the video is paused (e.g. its carousel slide is not visible). */
    active?: boolean;
}

const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const total = Math.floor(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) {
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, className = '', fill = false, active = true }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [scrubbing, setScrubbing] = useState(false);

    const progressPct = duration ? (currentTime / duration) * 100 : 0;
    const bufferedPct = duration ? (buffered / duration) * 100 : 0;

    /* ── Play / pause ── */
    const togglePlay = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused || v.ended) {
            v.play();
        } else {
            v.pause();
        }
    }, []);

    /* ── Auto-hide controls while playing ── */
    const revealControls = useCallback(() => {
        setShowControls(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) {
                setShowControls(false);
            }
        }, 2600);
    }, []);

    /* ── Seeking ── */
    const seekToClientX = useCallback((clientX: number) => {
        const v = videoRef.current;
        const bar = progressRef.current;
        if (!v || !bar || !duration) return;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        v.currentTime = ratio * duration;
        setCurrentTime(ratio * duration);
    }, [duration]);

    const handleScrubStart = (e: React.PointerEvent) => {
        e.preventDefault();
        setScrubbing(true);
        seekToClientX(e.clientX);
    };

    useEffect(() => {
        if (!scrubbing) return;
        const move = (e: PointerEvent) => seekToClientX(e.clientX);
        const up = () => setScrubbing(false);
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        return () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
    }, [scrubbing, seekToClientX]);

    /* ── Volume ── */
    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setMuted(v.muted);
        if (!v.muted && v.volume === 0) {
            v.volume = 0.6;
            setVolume(0.6);
        }
    };

    const changeVolume = (val: number) => {
        const v = videoRef.current;
        if (!v) return;
        v.volume = val;
        v.muted = val === 0;
        setVolume(val);
        setMuted(val === 0);
    };

    /* ── Fullscreen ── */
    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    /* ── Keyboard shortcuts (when player is focused/hovered) ── */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const v = videoRef.current;
        if (!v) return;
        switch (e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowRight':
                v.currentTime = Math.min(duration, v.currentTime + 5);
                break;
            case 'ArrowLeft':
                v.currentTime = Math.max(0, v.currentTime - 5);
                break;
            case 'm':
                toggleMute();
                break;
            case 'f':
                toggleFullscreen();
                break;
        }
    };

    useEffect(() => {
        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, []);

    /* ── Pause when the slide is scrolled away ── */
    useEffect(() => {
        if (!active && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
    }, [active]);

    const replay = () => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;
        v.play();
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseMove={revealControls}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            className={`group relative w-full overflow-hidden bg-black outline-none select-none ${fill ? 'h-full' : 'rounded-[2.5rem] border border-white/5 shadow-2xl'} ${isFullscreen ? 'rounded-none border-0 flex items-center justify-center' : ''} ${className}`}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                playsInline
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
                onPlay={() => { setIsPlaying(true); setHasEnded(false); revealControls(); }}
                onPause={() => { setIsPlaying(false); setShowControls(true); }}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => setIsLoading(false)}
                onCanPlay={() => setIsLoading(false)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => {
                    if (!scrubbing) setCurrentTime(e.currentTarget.currentTime);
                }}
                onProgress={(e) => {
                    const v = e.currentTarget;
                    if (v.buffered.length) {
                        setBuffered(v.buffered.end(v.buffered.length - 1));
                    }
                }}
                onEnded={() => { setIsPlaying(false); setHasEnded(true); setShowControls(true); }}
                className={`w-full bg-black object-contain ${isFullscreen ? 'max-h-screen' : fill ? 'h-full' : 'max-h-160'}`}
            />

            {/* ── Loading spinner ── */}
            {isLoading && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Loader2 size={46} className="animate-spin text-white/90 drop-shadow-lg" />
                </div>
            )}

            {/* ── Center play / replay button ── */}
            {!isPlaying && !isLoading && (
                <button
                    type="button"
                    onClick={hasEnded ? replay : togglePlay}
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    aria-label={hasEnded ? 'Replay' : 'Play'}
                >
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-white/25">
                        {hasEnded ? (
                            <RotateCcw size={30} className="text-white" />
                        ) : (
                            <Play size={32} className="ml-1 text-white fill-white" />
                        )}
                    </span>
                </button>
            )}

            {/* ── Control bar ── */}
            <div
                className={`absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/85 via-black/40 to-transparent px-4 pb-3 pt-12 transition-all duration-300 ${showControls || !isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
            >
                {/* Progress bar */}
                <div
                    ref={progressRef}
                    onPointerDown={handleScrubStart}
                    className="group/track relative mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition-all hover:h-2.5"
                >
                    {/* buffered */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/25"
                        style={{ width: `${bufferedPct}%` }}
                    />
                    {/* played */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-purple-500 to-indigo-500"
                        style={{ width: `${progressPct}%` }}
                    />
                    {/* thumb */}
                    <div
                        className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(168,85,247,0.8)] opacity-0 transition-opacity group-hover/track:opacity-100"
                        style={{ left: `${progressPct}%` }}
                    />
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-3 text-white">
                    <button type="button" onClick={togglePlay} className="transition-transform hover:scale-110" aria-label="Play/Pause">
                        {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white" />}
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 group/vol">
                        <button type="button" onClick={toggleMute} className="transition-transform hover:scale-110" aria-label="Mute">
                            {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={muted ? 0 : volume}
                            onChange={(e) => changeVolume(Number(e.target.value))}
                            className="vp-volume w-0 opacity-0 transition-all duration-300 group-hover/vol:w-20 group-hover/vol:opacity-100"
                            style={{ ['--vp-fill' as string]: `${(muted ? 0 : volume) * 100}%` }}
                        />
                    </div>

                    {/* Time */}
                    <span className="text-xs font-medium tabular-nums text-white/90">
                        {formatTime(currentTime)} <span className="text-white/50">/ {formatTime(duration)}</span>
                    </span>

                    <div className="flex-1" />

                    {/* Fullscreen */}
                    <button type="button" onClick={toggleFullscreen} className="transition-transform hover:scale-110" aria-label="Fullscreen">
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                </div>
            </div>

            <style>{`
                .vp-volume {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 4px;
                    border-radius: 9999px;
                    background: linear-gradient(to right, #a855f7 var(--vp-fill, 100%), rgba(255,255,255,0.25) var(--vp-fill, 100%));
                    cursor: pointer;
                }
                .vp-volume::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 9999px;
                    background: #fff;
                    box-shadow: 0 0 6px rgba(168,85,247,0.8);
                }
                .vp-volume::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    border: none;
                    border-radius: 9999px;
                    background: #fff;
                    box-shadow: 0 0 6px rgba(168,85,247,0.8);
                }
            `}</style>
        </div>
    );
};

export default VideoPlayer;
