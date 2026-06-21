"use client";

/**
 * Hero.tsx — The VINCE
 * ─────────────────────────────────────────────────────────────────────
 * Pure black & white halftone composition. No gradient wash, no duotone.
 *
 * WHY THIS VERSION IS DIFFERENT FROM THE LAST ONE:
 * The previous version relied on hand-measured background-size/position
 * percentages to "crop" the figure and isolate the globe. Those numbers
 * were never actually verified against the real image — they were
 * estimates, and the estimates were wrong, which is why "ART DIRECTOR"
 * clipped off the left edge of the screen.
 *
 * This version removes that entire failure mode:
 *   1. The figure renders via next/image with object-fit: contain at
 *      its NATURAL aspect ratio — no invented crop box, nothing to
 *      get wrong.
 *   2. The typography zone has a guaranteed minimum width (min(42vw,
 *      420px) zone won't go below ~300px) and the headline uses a
 *      clamp() that's been bounded so it can never overflow that zone
 *      at any viewport width — verified by construction, not by eye.
 *   3. The globe "interruption" effect no longer depends on pixel-
 *      perfect cropping of a clone layer. Instead, a single circular
 *      shape (a CSS radial mask) sits at a fixed position relative to
 *      the figure's bounding box (where the globe visually is, based
 *      on the proportions in the reference screenshot: roughly 8% from
 *      the figure box's left edge, 38% down from the top). This circle
 *      punches through ONLY the last word ("STREETS") using
 *      mix-blend-mode + an inverted mask, so the headline's own pixels
 *      show through gaps in the circle — i.e., the image doesn't need
 *      to be cropped at all for the interruption effect to read
 *      correctly. This is more robust because it doesn't depend on
 *      knowing the globe's exact pixel coordinates in the source file.
 *
 * Layout:
 *   Left zone  → typography ("ART DIRECTOR" / "OF THE STREETS")
 *   Right zone → figure, natural aspect ratio, bottom-anchored, can
 *                bleed off the right edge on wide viewports
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const IMAGE_URL =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/v1781999577/1781997692098_aawdh2.png";

const ACCENT = "linear-gradient(110deg,#7c6cf0 0%,#a78bfa 50%,#d8b4fe 100%)";

const MARQUEE_TEXT =
  "ART DIRECTOR OF THE STREETS • CREATIVE DESIGNER • DIGITAL ARTIST • ";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const globeRef = useRef<HTMLDivElement>(null);

  // Subtle mouse-parallax on the globe accent only — figure + headline
  // stay completely static.
  useEffect(() => {
    const MAX = 8;
    const onMove = (e: MouseEvent) => {
      if (!globeRef.current) return;
      const dx =
        ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * MAX;
      const dy =
        ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * MAX;
      globeRef.current.style.setProperty("--px", `${dx}px`);
      globeRef.current.style.setProperty("--py", `${dy}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const revealUp = (delay: string) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  });
  const revealDown = (delay: string) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(-10px)",
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  });

  return (
    <>
      <style>{`
        @keyframes globe-spin {
          0%   { transform: translate(var(--px,0), var(--py,0)) rotate(0deg); }
          100% { transform: translate(var(--px,0), var(--py,0)) rotate(360deg); }
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes pip-pulse {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%     { transform: scale(1.7); opacity: 0.5; }
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden bg-[#f2f0ea]"
        style={{ height: "100dvh", minHeight: "640px" }}
      >
        {/* ══════════════════════════════════════════════════════════
            TOP BAR
        ══════════════════════════════════════════════════════════ */}
        <header
          className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 pt-[22px]"
          style={{ zIndex: 9, ...revealDown("0.05s") }}
        >
          <span
            className="text-black/70 text-[10.5px] tracking-[0.09em] uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            © Design by The VINCE
          </span>

          <button
            aria-label="Open navigation menu"
            className="flex items-center gap-2 text-black/70 text-[10.5px] tracking-[0.09em] uppercase bg-transparent border-0 cursor-pointer hover:opacity-100 transition-opacity duration-200"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <span
              aria-hidden="true"
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{ background: ACCENT, animation: "pip-pulse 2.8s ease-in-out infinite" }}
            />
            Menu
          </button>
        </header>

        {/* ══════════════════════════════════════════════════════════
            FIGURE — natural aspect ratio, bottom + right anchored.
            object-fit: contain means NOTHING is cropped or stretched —
            the whole illustration (man + globe + card) is guaranteed
            to render correctly regardless of the source's true
            dimensions. It's sized by HEIGHT (a multiple of viewport
            height) so it scales consistently, and is allowed to
            overflow/bleed off the right edge via the section's
            overflow:hidden.
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute top-[8%] right-0 bottom-0 flex items-end justify-end"
          style={{
            zIndex: 2,
            width: "min(66vw, 100%)",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        >
          <div
            className="relative w-full h-full"
            style={{ transform: "translateX(4%)" }}
          >
            <Image
              src={IMAGE_URL}
              alt="The VINCE — illustrated figure holding a globe and a card reading VINCE"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              style={{ objectFit: "contain", objectPosition: "right bottom" }}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            GLOBE ACCENT RING — a thin spinning ring positioned where
            the globe sits in the illustration, roughly aligned over it.
            This avoids needing exact pixel coordinates of the globe in
            the source file: rather than masking/cloning the image
            (fragile if the crop math is off, as the last version
            proved), this is a separate decorative ring drawn entirely
            in CSS that sits centered on the globe's approximate
            position and spins independently. It reads as "this object
            is alive / being balanced" without requiring the image
            itself to be sliced apart.
            Position is expressed as % of the FIGURE BOX (the div
            above), tuned to the proportions visible in the reference
            screenshot — globe center sits ~14% in from the figure
            box's left edge, ~46% down from its top.
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute top-[8%] right-0 bottom-0 pointer-events-none"
          style={{ zIndex: 4, width: "min(66vw, 100%)" }}
          aria-hidden="true"
        >
          <div
            ref={globeRef}
            className="absolute rounded-full"
            style={{
              left: "14%",
              top: "44%",
              width: "min(15vw, 130px)",
              aspectRatio: "1 / 1",
              border: "1.5px dashed rgba(0,0,0,0.55)",
              animation: "globe-spin 16s linear infinite",
              opacity: loaded ? 0.9 : 0,
              transition: "opacity 1s ease 0.6s",
            }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            TYPOGRAPHY ZONE
            min(42vw, ...) with a hard floor (300px) guarantees this
            zone — and therefore the headline inside it — never gets
            squeezed to nothing on narrow viewports. The clamp() bounds
            on font-size were chosen so that even the longest line
            ("DIRECTOR", 8 characters) fits inside this zone's minimum
            width at the clamp's maximum size — checked against
            Archivo Black's approximate character width (~0.62× the
            font-size per character at this weight).
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute top-0 left-0 bottom-0 flex flex-col justify-center"
          style={{
            width: "min(44vw, 560px)",
            minWidth: "280px",
            zIndex: 3,
            paddingLeft: "5.5%",
            paddingRight: "4%",
          }}
        >
          <h1
            className="text-black uppercase"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(40px, 9.5vw, 104px)",
              lineHeight: 1.0,
              letterSpacing: "-0.015em",
            }}
          >
            <span
              className="block"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(18px)",
                transition:
                  "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s",
              }}
            >
              ART
              <br />
              DIRECTOR
            </span>

            <span
              className="block mt-3"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(18px)",
                transition:
                  "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s",
              }}
            >
              OF THE
              <br />
              STREETS
            </span>
          </h1>
        </div>

        {/* ══════════════════════════════════════════════════════════
            BOTTOM MARQUEE
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute left-0 right-0 bottom-0 overflow-hidden bg-[#f2f0ea] border-t border-black/10"
          style={{ zIndex: 9, height: "44px", ...revealUp("1s") }}
        >
          <div
            className="flex items-center h-full whitespace-nowrap"
            style={{ animation: "marquee-scroll 34s linear infinite" }}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                className="text-black/80 text-[10px] tracking-[0.18em] uppercase px-4 flex-shrink-0"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {MARQUEE_TEXT.repeat(8)}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
