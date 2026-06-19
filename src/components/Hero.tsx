"use client";

/**
 * Hero.tsx — The VINCE
 * ─────────────────────────────────────────────────────────────────────
 * Depth-sandwich effect: a scrolling marquee exists on two z-index layers.
 *  - MarqueeLayer clip="bottom"  z-index 1  → sits BEHIND the portrait
 *  - Portrait                    z-index 2
 *  - Vignette overlay            z-index 3
 *  - MarqueeLayer clip="top"     z-index 4  → floats IN FRONT of portrait
 *  - Topbar / Footer / Cues      z-index 9
 *
 * The subject stands literally INSIDE a continuously scrolling line of text.
 * ─────────────────────────────────────────────────────────────────────
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
const HERO_IMAGE_SRC = "https://res.cloudinary.com/dx3k7hbnc/image/upload/v1781828709/Heroimage_hgsqux.png";

// ─── Iris gradient constant (single source of truth) ──────────────────
const IRIS = "linear-gradient(110deg,#c8a2ff 0%,#7dd4fc 38%,#f0abfc 68%,#86efac 100%)";

// ─── IrisText ─────────────────────────────────────────────────────────
function IrisText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{ background: IRIS, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
    >
      {children}
    </span>
  );
}

// ─── GlobeSVG — refined, polished outline globe ───────────────────────
function GlobeSVG() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className="w-[22px] h-[22px]"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="40" stroke="#f0ece2" strokeWidth="2.4" />
      <path
        d="M50 10 C 34 10 26 28 26 50 C 26 72 34 90 50 90 C 66 90 74 72 74 50 C 74 28 66 10 50 10 Z"
        stroke="#f0ece2"
        strokeWidth="1.6"
      />
      <ellipse cx="50" cy="50" rx="40" ry="13.5" stroke="#f0ece2" strokeWidth="1.6" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="#f0ece2" strokeWidth="1.6" />
    </svg>
  );
}

// ─── MarqueeLayer ───────────────────────────────────────────────────────
type MarqueeLayerProps = { clip: "top" | "bottom"; loaded: boolean };

function MarqueeLayer({ clip, loaded }: MarqueeLayerProps) {
  const isFront = clip === "top";
  const ITEM = "ART DIRECTOR OF THE STREET";

  return (
    <div
      aria-hidden="true"
      className="absolute left-0 right-0 select-none pointer-events-none overflow-hidden"
      style={{
        bottom: "76px",
        zIndex: isFront ? 4 : 1,
        // Front layer: show only top 52% — portrait face shows through below
        // Back layer:  show only bottom 48% — peeks out behind the face
        clipPath: isFront ? "inset(0 0 48% 0)" : "inset(52% 0 0 0)",
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : `translateY(${isFront ? "-14px" : "14px"})`,
        transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s",
      }}
    >
      <div
        className="flex whitespace-nowrap font-display uppercase tracking-[-0.02em] leading-[0.84] text-[#f0ece2] animate-[marquee-scroll_22s_linear_infinite]"
        style={{ fontSize: "clamp(62px, 19.5vw, 210px)" }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="flex items-center pl-0.5">
            {ITEM}
            <span className="inline-flex items-center justify-center mx-8 md:mx-10">
              <IrisText>★</IrisText>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hero (default export) ────────────────────────────────────────────
export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Reveal as soon as component mounts — image is embedded, no network wait
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTimeout(() => setLoaded(true), 60);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Cursor parallax — portrait drifts ±7px, marquee layers stay fixed
  useEffect(() => {
    const MAX = 7;
    const onMove = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const dx = ((e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2)) * MAX;
      const dy = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * MAX;
      wrapRef.current.style.transform = `translate(${dx}px,${dy}px)`;
    };
    const onLeave = () => {
      if (wrapRef.current) wrapRef.current.style.transform = "translate(0,0)";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Shared transition helpers
  const revealUp = (delay: string) => ({
    opacity:    loaded ? 1 : 0,
    transform:  loaded ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  });
  const revealDown = (delay: string) => ({
    opacity:    loaded ? 1 : 0,
    transform:  loaded ? "translateY(0)" : "translateY(-10px)",
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  });

  return (
    <section
      className="relative w-full overflow-hidden bg-[#090909]"
      style={{ height: "100dvh", minHeight: "600px" }}
    >
      {/* ── Iridescent scan — ambient shimmer sweeps L→R ──────── */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 pointer-events-none animate-[iris-sweep_9s_linear_infinite]"
        style={{
          width: "10rem",
          zIndex: 5,
          background: "linear-gradient(to right,transparent 0%,rgba(200,162,255,0.055) 30%,rgba(125,212,252,0.09) 50%,rgba(200,162,255,0.055) 70%,transparent 100%)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s 1.4s",
        }}
      />

      {/* ── Marquee — BACK (z1, behind portrait) ──────────────── */}
      <MarqueeLayer clip="bottom" loaded={loaded} />

      {/* ── Portrait (z2) ─────────────────────────────────────── */}
      <div
        ref={wrapRef}
        className="absolute inset-0"
        style={{ zIndex: 2, transition: "transform 1s cubic-bezier(0.25,0.46,0.45,0.94)", willChange: "transform" }}
      >
        <Image
          src={HERO_IMAGE_SRC}
          alt="The VINCE — Creative Designer & Digital Artist"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_22%]"
          style={{
            opacity:    loaded ? 1 : 0,
            transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}
        />

        {/* Vignette — heavier at foot, breathing room at top (z3) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to bottom,rgba(9,9,9,0.30) 0%,transparent 18%,transparent 48%,rgba(9,9,9,0.80) 78%,rgba(9,9,9,0.97) 100%)",
          }}
        />
      </div>

      {/* ── Marquee — FRONT (z4, above portrait) ──────────────── */}
      <MarqueeLayer clip="top" loaded={loaded} />

      {/* ── Topbar (z9) ───────────────────────────────────────── */}
      <header
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 pt-[22px]"
        style={{ zIndex: 9, ...revealDown("0.05s") }}
      >
        {/* Accessible page title — visually hidden */}
        <h1 className="sr-only">The VINCE — Creative Designer &amp; Digital Artist</h1>

        <span className="font-mono text-[10.5px] tracking-[0.09em] uppercase text-[#f0ece2]/60">
          © Design by The Vince
        </span>

        <button
          aria-label="Open navigation menu"
          className="flex items-center gap-2.5 font-sans font-medium text-base tracking-[-0.01em] text-[#f0ece2]/90 bg-transparent border-0 cursor-pointer transition-opacity duration-200 hover:opacity-100"
        >
          {/* Iridescent pulsing pip */}
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full flex-shrink-0 animate-[pip-pulse_2.8s_ease-in-out_infinite]"
            style={{ background: IRIS }}
          />
          Menu
        </button>
      </header>

      {/* ── Scroll cue (z9) ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute left-6 flex flex-col items-center gap-1.5"
        style={{ bottom: "132px", zIndex: 9, ...revealUp("1.25s") }}
      >
        <div
          className="w-px h-9"
          style={{ background: "linear-gradient(to bottom,transparent,rgba(240,236,226,0.28))" }}
        />
        <span className="text-sm text-[#f0ece2]/40" style={{ transform: "rotate(45deg)" }}>↘</span>
      </div>

      {/* ── Footer (z9) ───────────────────────────────────────── */}
      <footer
        className="absolute left-0 right-0 bottom-0 flex justify-between items-end px-6 pb-7"
        style={{ zIndex: 9, ...revealUp("1.05s") }}
      >
        {/* Tagline */}
        <div className="flex flex-col gap-0.5">
          <span
            className="font-sans font-normal tracking-[-0.01em] leading-[1.2] text-[#f0ece2]"
            style={{ fontSize: "clamp(16px, 4.2vw, 24px)" }}
          >
            Creative Designer
          </span>
          <IrisText className="font-sans font-normal tracking-[-0.01em] leading-[1.2]">
            <span style={{ fontSize: "clamp(16px, 4.2vw, 24px)" }}>Digital Artist</span>
          </IrisText>
        </div>

        {/* Globe + badge */}
        <div className="flex flex-col items-end gap-2.5">
          {/* Available badge — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] tracking-[0.10em] uppercase text-[#f0ece2]/55 bg-white/[0.05] border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#86efac] flex-shrink-0 animate-[avail-ping_2s_ease-in-out_infinite]"
              aria-hidden="true"
            />
            Available for work
          </div>

          {/* Globe */}
          <div
            className="w-11 h-11 rounded-full border border-[rgba(240,236,226,0.28)] grid place-items-center bg-[rgba(9,9,9,0.35)] backdrop-blur-lg overflow-hidden flex-shrink-0"
            aria-hidden="true"
          >
            <GlobeSVG />
          </div>
        </div>
      </footer>
    </section>
  );
}
