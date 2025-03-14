"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loadingStates, setLoadingStates] = useState({
    blogs: false,
    login: false,
    register: false,
    create: false,
    logout: false,
    home: false,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [riftPosition, setRiftPosition] = useState({ x: 50, y: 50 });
  const [riftParticles, setRiftParticles] = useState<React.ReactNode[]>([]);
  const navRef = useRef<HTMLDivElement>(null);

  // Generate rift particles only on client-side mount and update with riftPosition
  useEffect(() => {
    const particles = Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-lumen-cyan/50 rounded-full shadow-[0_0_5px_rgba(0,200,255,0.4)] animate-orbit"
        style={{
          left: `${riftPosition.x + Math.cos(i * 2.094) * 10}%`,
          top: `${riftPosition.y + Math.sin(i * 2.094) * 10}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ));
    setRiftParticles(particles);
  }, [riftPosition]); // Re-run when riftPosition changes

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setRiftPosition({ x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) });
    }
  };

  useEffect(() => {
    const isEditOrCreatePage =
      pathname === "/blogs/create" || pathname.startsWith("/blogs/edit");

    const preventAction = (e: Event) => {
      if (!isEditOrCreatePage) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: Event) => {
      if (!isEditOrCreatePage) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", preventAction);
    document.addEventListener("cut", preventAction);
    document.addEventListener("paste", preventAction);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("cut", preventAction);
      document.removeEventListener("paste", preventAction);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [pathname]);

  const handleLogout = async () => {
    setLoadingStates((prev) => ({ ...prev, logout: true }));
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, logout: false }));
    }
  };

  const handleNavigate = async (path: string, key: keyof typeof loadingStates) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }));
    try {
      await router.push(path);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
      setIsMenuOpen(false);
    }
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 w-full h-[80px] bg-depth-black z-50 flex items-center justify-center">
        <Loader />
      </nav>
    );
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full h-[80px] bg-depth-black z-50 animate-slideIn overflow-hidden shadow-[0_0_10px_rgba(0,200,255,0.2)]"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,10,15,0.95),rgba(20,20,30,0.9))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--rift-x)_var(--rift-y),rgba(0,200,255,0.15),transparent_60%)] animate-fluxPulse" />
        {riftParticles}
      </div>

      <div className="container mx-auto px-4 h-full flex justify-between items-center relative z-10">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            src="https://assets.grok.com/users/e55a76f6-9de3-4b01-b387-6f930e4d3db7/FdtcuE5DS4x1Cc8n-generated_image.jpg"
            alt="NIVOX Logo"
            width={90}
            height={90}
            className="rounded-full transform group-hover:scale-110 transition-transform duration-300 shadow-[0_0_8px_rgba(0,200,255,0.3)]"
          />
          <span className="text-xl font-mono text-lumen-white tracking-tight group-hover:text-lumen-cyan transition-colors duration-300">
            NIVOX
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-lumen-white focus:outline-none hover:text-lumen-cyan transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6 absolute md:static top-[80px] left-0 w-full md:w-auto bg-depth-black/95 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(0,200,255,0.2)] md:shadow-none`}
        >
          <button
            onClick={() => handleNavigate("/blogs", "blogs")}
            className="relative text-lumen-white font-mono px-4 py-2 bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(0,255,200,0.2))] hover:bg-[linear-gradient(45deg,rgba(0,200,255,0.3),rgba(0,255,200,0.3))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md"
          >
            {loadingStates.blogs ? <Loader /> : "Blogs"}
            <span className="absolute inset-0 bg-lumen-cyan/10 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
            <span className="absolute inset-0 border border-lumen-cyan/30 rounded-md animate-quantumPulseBorder" />
          </button>

          {user ? (
            <>
              <button
                onClick={() => handleNavigate("/blogs/create", "create")}
                className="relative text-lumen-white font-mono px-4 py-2 bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(0,255,200,0.2))] hover:bg-[linear-gradient(45deg,rgba(0,200,255,0.3),rgba(0,255,200,0.3))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md"
              >
                {loadingStates.create ? <Loader /> : "Create Post"}
                <span className="absolute inset-0 bg-lumen-cyan/10 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
                <span className="absolute inset-0 border border-lumen-cyan/30 rounded-md animate-quantumPulseBorder" />
              </button>
              <button
                onClick={handleLogout}
                className="relative text-lumen-white font-mono px-4 py-2 bg-[linear-gradient(45deg,rgba(200,0,255,0.2),rgba(150,100,255,0.2))] hover:bg-[linear-gradient(45deg,rgba(200,0,255,0.3),rgba(150,100,255,0.3))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md"
              >
                {loadingStates.logout ? <Loader /> : "Logout"}
                <span className="absolute inset-0 bg-lumen-magenta/10 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
                <span className="absolute inset-0 border border-lumen-magenta/30 rounded-md animate-quantumPulseBorder" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate("/auth/login", "login")}
                className="relative text-lumen-white font-mono px-4 py-2 bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(0,255,200,0.2))] hover:bg-[linear-gradient(45deg,rgba(0,200,255,0.3),rgba(0,255,200,0.3))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md"
              >
                {loadingStates.login ? <Loader /> : "Login"}
                <span className="absolute inset-0 bg-lumen-cyan/10 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
                <span className="absolute inset-0 border border-lumen-cyan/30 rounded-md animate-quantumPulseBorder" />
              </button>
              <button
                onClick={() => handleNavigate("/auth/register", "register")}
                className="relative text-lumen-white font-mono px-4 py-2 bg-[linear-gradient(45deg,rgba(200,0,255,0.2),rgba(150,100,255,0.2))] hover:bg-[linear-gradient(45deg,rgba(200,0,255,0.3),rgba(150,100,255,0.3))] transition-all duration-300 disabled:opacity-50 group animate-quantumPulse rounded-md"
              >
                {loadingStates.register ? <Loader /> : "Register"}
                <span className="absolute inset-0 bg-lumen-magenta/10 rounded-md scale-0 group-hover:scale-125 transition-transform duration-400 origin-center animate-quantumPulseGlow" />
                <span className="absolute inset-0 border border-lumen-magenta/30 rounded-md animate-quantumPulseBorder" />
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        :global(:root) {
          --depth-black: #0A0A0F;
          --lumen-white: #E0F0FF;
          --lumen-cyan: #00C8FF;
          --lumen-magenta: #FF00C8;
        }
        .bg-depth-black { background-color: var(--depth-black); }
        .text-lumen-white { color: var(--lumen-white); }
        .text-lumen-cyan { color: var(--lumen-cyan); }
        .text-lumen-magenta { color: var(--lumen-magenta); }
        .bg-lumen-cyan { background-color: var(--lumen-cyan); }
        .bg-lumen-magenta { background-color: var(--lumen-magenta); }

        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fluxPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes orbit {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes quantumPulse {
          0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
          30% { transform: translate(1px, -1px) scale(1.01); opacity: 0.95; }
          60% { transform: translate(-1px, 1px) scale(0.99); opacity: 0.85; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.9; }
        }
        @keyframes quantumPulseGlow {
          0% { transform: scale(0); opacity: 0.3; filter: blur(2px); }
          40% { transform: scale(1.1); opacity: 0.5; filter: blur(1px); }
          70% { transform: scale(0.9); opacity: 0.4; filter: blur(3px); }
          100% { transform: scale(1); opacity: 0.3; filter: blur(2px); }
        }
        @keyframes quantumPulseBorder {
          0% { border-color: rgba(0, 200, 255, 0.3); transform: translate(0, 0); }
          25% { border-color: rgba(255, 0, 200, 0.35); transform: translate(0.5px, -0.5px); }
          50% { border-color: rgba(0, 200, 255, 0.25); transform: translate(-0.5px, 0.5px); }
          75% { border-color: rgba(255, 0, 200, 0.3); transform: translate(0, 0.5px); }
          100% { border-color: rgba(0, 200, 255, 0.3); transform: translate(0, 0); }
        }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .animate-fluxPulse {
          animation: fluxPulse 4s ease-in-out infinite;
          --rift-x: ${riftPosition.x}%;
          --rift-y: ${riftPosition.y}%;
        }
        .animate-orbit { animation: orbit 6s linear infinite; }
        .animate-quantumPulse { animation: quantumPulse 1.2s infinite ease-in-out; }
        .animate-quantumPulseGlow { animation: quantumPulseGlow 1.5s infinite ease-in-out; }
        .animate-quantumPulseBorder { animation: quantumPulseBorder 1.8s infinite ease-in-out; }
        button:hover .animate-quantumPulseGlow { transform: scale(125%); }
      `}</style>
    </nav>
  );
}