"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Sparkles, Film, Maximize2 } from "lucide-react";

export function ParallaxVideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax 3D tilt & zoom transform
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.8]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl mx-auto my-12 px-4 perspective-[1200px]"
    >
      <motion.div
        style={{ rotateX, scale, opacity }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="relative group rounded-2xl p-1 bg-gradient-to-b from-purple-500/30 via-blue-500/20 to-transparent shadow-[0_0_50px_-12px_rgba(137,87,229,0.35)]"
      >
        {/* Ambient background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition duration-700 pointer-events-none" />

        <div className="relative rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d]/80 shadow-2xl">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#161b22]/90 border-b border-[#30363d]/70 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-neutral-400 hidden sm:inline">
                git-wit • Interactive Video Showcase
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>1080p 30fps Cinematic</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/60 px-2.5 py-0.5 rounded-full hidden md:flex">
                <Film className="w-3 h-3 text-blue-400" />
                <span>Dual-Brain Architecture</span>
              </span>
            </div>
          </div>

          {/* Video Player Frame */}
          <div className="relative aspect-video w-full bg-black/95 overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              src="/brag.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover select-none"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors cursor-pointer"
                  title={isPlaying ? "Pause Video" : "Play Video"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors cursor-pointer"
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <span className="text-xs text-neutral-300 font-medium hidden sm:inline">
                  {isMuted ? "Audio Muted — click to listen to beat soundtrack" : "Audio Active"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
