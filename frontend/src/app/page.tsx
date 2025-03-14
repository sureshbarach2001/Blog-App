"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react"; // Added useState and useEffect

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const [latticeNodes, setLatticeNodes] = useState<React.ReactNode[]>([]);

  // Generate lattice nodes only on client-side mount
  useEffect(() => {
    const nodes = Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-lumen-white/20 rounded-full animate-latticeNode"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ));
    setLatticeNodes(nodes);
  }, []);

  // Handle cursor interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (homeRef.current) {
      const rect = homeRef.current.getBoundingClientRect();
      const cursorX = ((e.clientX - rect.left) / rect.width) * 100;
      const cursorY = ((e.clientY - rect.top) / rect.height) * 100;

      homeRef.current.style.setProperty("--cursor-x", `${cursorX}%`);
      homeRef.current.style.setProperty("--cursor-y", `${cursorY}%`);
    }
  };

  return (
    <div
      ref={homeRef}
      className="fixed inset-0 bg-depth-black flex flex-col overflow-hidden pt-[80px] z-10"
      onMouseMove={handleMouseMove}
    >
      {/* Infinite-Depth Lattice */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDrift">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDriftReverse" />
        <div className="absolute inset-0">{latticeNodes}</div>
        {/* Cursor Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--cursor-x)_var(--cursor-y),rgba(0,200,255,0.2),transparent_50%)] pointer-events-none animate-cursorGlow" />
      </div>

      {/* Content */}
      <div className="flex-1 w-full flex items-center justify-center z-10">
        <div className="relative max-w-4xl text-center transform transition-all duration-500 animate-paneRise">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] opacity-50 rounded-xl animate-paneTrail" />
          <div className="relative z-10 bg-depth-black/80 p-8 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] hover:shadow-[0_0_30px_rgba(0,200,255,0.7)] transition-all duration-300">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono text-lumen-white tracking-wider animate-depthGlow mb-6">
              Welcome to Blog App
            </h1>
            <p className="text-base sm:text-lg text-lumen-white/70 mb-8">
              Share your thoughts with the world!
            </p>
            <Link
              href="/blogs"
              className="relative inline-block px-6 py-3 bg-[linear-gradient(45deg,#00C8FF,#FF00C8)] text-lumen-white font-mono font-semibold rounded-md hover:bg-[linear-gradient(45deg,#00E0FF,#FF33D6)] hover:shadow-[0_0_15px_rgba(0,200,255,0.7)] hover:scale-105 transition-all duration-300"
            >
              View Blogs
            </Link>
          </div>
          <div className="absolute inset-0 border border-lumen-cyan/20 rounded-xl animate-paneEdge" />
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        /* Custom Depth Colors */
        :global(:root) {
          --depth-black: #0A0A0F;
          --lumen-white: #E0F0FF;
          --lumen-cyan: #00C8FF;
          --lumen-magenta: #FF00C8;
        }
        .bg-depth-black {
          background-color: var(--depth-black);
        }
        .text-lumen-white {
          color: var(--lumen-white);
        }
        .text-lumen-cyan {
          color: var(--lumen-cyan);
        }
        .text-lumen-magenta {
          color: var(--lumen-magenta);
        }
        .border-lumen-cyan {
          border-color: var(--lumen-cyan);
        }

        @keyframes latticeDrift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 30px 30px;
          }
        }
        @keyframes latticeDriftReverse {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: -30px -30px;
          }
        }
        @keyframes latticeNode {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.5);
          }
        }
        @keyframes cursorGlow {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        @keyframes depthGlow {
          0%,
          100% {
            text-shadow: 0 0 5px rgba(0, 200, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 200, 255, 0.5),
              0 0 5px rgba(255, 0, 200, 0.5);
          }
        }
        @keyframes paneRise {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes paneTrail {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
        @keyframes paneEdge {
          0%,
          100% {
            border-color: rgba(0, 200, 255, 0.2);
          }
          50% {
            border-color: rgba(0, 200, 255, 0.4);
          }
        }
        .animate-latticeDrift {
          animation: latticeDrift 25s linear infinite;
        }
        .animate-latticeDriftReverse {
          animation: latticeDriftReverse 25s linear infinite;
        }
        .animate-latticeNode {
          animation: latticeNode 3s ease-in-out infinite;
        }
        .animate-cursorGlow {
          animation: cursorGlow 2s ease-in-out infinite;
        }
        .animate-depthGlow {
          animation: depthGlow 2s ease-in-out infinite;
        }
        .animate-paneRise {
          animation: paneRise 0.5s ease-out forwards;
        }
        .animate-paneTrail {
          animation: paneTrail 1.5s ease-in-out infinite;
        }
        .animate-paneEdge {
          animation: paneEdge 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}