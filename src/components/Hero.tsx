"use client";

/**
 * Hero.tsx — The VINCE
 * ─────────────────────────────────────────────────────────────────────
 * Pure black & white halftone composition. No gradient wash, no duotone.
 *
 * REQUIRED: this version uses the "Anton" Google Font for the headline
 * (a heavy condensed display face — closest free match to the BADMASH
 * reference's letterform shape, used WITHOUT the metallic/fire effect
 * per direction: shape only, kept flat to match the halftone figure).
 * Add it via next/font in your layout, e.g.:
 *
 *   import { Anton } from 'next/font/google';
 *   const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
 *
 * ...and apply `anton.variable` to your root layout's className, OR
 * simplest for GitHub-mobile-only editing: add this line inside the
 * <head> of your root layout.tsx:
 *
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
 *
 * CHANGES IN THIS VERSION (vs. previous):
 *   1. Globe now spins as part of the actual image (a circular crop of
 *      the same source photo, scaled + positioned to isolate the globe
 *      region) rather than a floating decorative ring — see inline
 *      comment at the globe overlay for exact values and how to nudge
 *      them if misaligned.
 *   2. Figure raised higher in frame (top-[-2%], wider box at 70vw) so
 *      it reads larger overall.
 *   3. The floating dashed "accent ring" near the headline has been
 *      removed entirely.
 *   4. Headline font switched to Anton — heavier, more condensed, more
 *      aggressive than Archivo Black, matching the BADMASH reference's
 *      letterform weight/shape (without the 3D metal/fire treatment).
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
            className="text-black/70 text-[42px] tracking-[0.09em] uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            © Design by The VINCE
          </span>

          <button
            aria-label="Open navigation menu"
            className="flex items-center gap-2 text-black/70 text-[42px] tracking-[0.09em] uppercase bg-transparent border-0 cursor-pointer hover:opacity-100 transition-opacity duration-200"
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
            object-fit: contain means NOTHING is cropped or stretched.
            Raised from the previous version (top-[8%] → top-[-2%], and
            wider box) so the figure sits higher in the frame and
            reads larger — per "enlarge it up a bit" feedback.
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute top-[-2%] right-0 bottom-0 flex items-end justify-end"
          style={{
            zIndex: 2,
            width: "min(70vw, 100%)",
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
              sizes="(max-width: 768px) 100vw, 70vw"
              style={{ objectFit: "contain", objectPosition: "right bottom" }}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />

            {/* ──────────────────────────────────────────────────────
                SPINNING GLOBE OVERLAY — sits exactly on top of the
                globe drawn in the source image.

                These coordinates were measured directly off the live
                screenshot you sent (not estimated) — the figure box
                spans roughly x:230–700px / y:996–1426px in that 720px-
                wide screenshot, and the actual round globe (continents
                texture, bottom-left of the figure) spans roughly
                x:270–410px / y:1115–1255px within it. Converted to %
                of the figure box: left≈8.5%, top≈27.7%, width≈30%,
                height≈33%. The previous values (left:23%, top:66%)
                were a rough guess and landed on his shoulder/jacket
                instead — this replaces them with the measured ones.
            ────────────────────────────────────────────────────────── */}
            <div
              ref={globeRef}
              className="absolute rounded-full overflow-hidden"
              style={{
                left: "8.5%",
                top: "27.7%",
                width: "30%",
                aspectRatio: "1 / 1",
                animation: "globe-spin 13s linear infinite",
                opacity: loaded ? 1 : 0,
                transition: "opacity 1s ease 0.5s",
              }}
            >
              <Image
                src={IMAGE_URL}
                alt=""
                aria-hidden="true"
                fill
                sizes="20vw"
                style={{
                  objectFit: "cover",
                  // Anchor point = center of the measured crop window
                  // (23.4%, 44%), scaled up so only that globe-sized
                  // region fills this circular frame. scale ≈ 100/30
                  // ≈ 3.3x given the window is ~30% of the figure box.
                  objectPosition: "23.4% 44%",
                  transform: "scale(3.3)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TYPOGRAPHY ZONE
            min(44vw, 560px) with a hard floor (280px) guarantees this
            zone — and therefore the headline inside it — never gets
            squeezed to nothing on narrow viewports. Anton is a
            condensed face (narrower per-character than Archivo Black),
            so the clamp() max (104px) leaves comfortable margin for
            "DIRECTOR" even at the zone's minimum width.
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
              fontFamily: "'Anton', 'Archivo Black', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(40px, 9.5vw, 104px)",
              lineHeight: 0.94,
              letterSpacing: "-0.01em",
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
                className="text-black/80 text-[25px] tracking-[0.18em] uppercase px-4 flex-shrink-0"
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
