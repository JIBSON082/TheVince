"use client";

/**
 * Hero.tsx — The VINCE
 * ─────────────────────────────────────────────────────────────────────
 * Pure black & white halftone composition. No gradient wash, no duotone.
 *
 * Headline font: Anton (heavy condensed display face). Add via next/font
 * in your root layout, e.g.:
 *
 *   import { Anton } from 'next/font/google';
 *   const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
 *
 * ...or simplest for GitHub-mobile-only editing, add inside <head> of
 * your root layout.tsx:
 *
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
 *
 * ─────────────────────────────────────────────────────────────────────
 * FIX IN THIS VERSION — the "white blob" bug
 * ─────────────────────────────────────────────────────────────────────
 * The previous version used a SEPARATE globe-only image plus a solid
 * color "patch" behind it to cover the static globe baked into the
 * base figure photo. That patch was a flat off-white circle, but the
 * actual photo has halftone dot texture and tonal variation underneath
 * — so the patch rendered as a visible white sticker on top of the
 * image. That's the artifact you saw.
 *
 * The fix removes both problems at once:
 *   1. No second image — the spinning globe is cropped directly out of
 *      the SAME composite photo (IMAGE_URL). Only one asset, as required.
 *   2. No patch — the spinning crop is positioned to land in the exact
 *      same pixels as the static globe underneath (same box-sizing
 *      rules as the figure layer: same width, same anchor, same
 *      translateX), so it occludes the static globe simply by sitting
 *      on top of it (z-index), with pixel-perfect alignment and no
 *      visible seam.
 *
 * Globe crop coordinates were measured directly from the raw 1024×1024
 * source file via connected-component pixel analysis on the actual
 * file (not estimated from a screenshot): bbox x[12.5–32.6]%,
 * y[24.5–49.9]%, padded 2%, then expanded to a true circle (diameter
 * = larger of width/height span = 29.4%) centered on the globe so nothing
 * is cropped and the clip window is a real circle, not an ellipse.
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

const IMAGE_URL =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/v1781999577/1781997692098_aawdh2.png";

const ACCENT = "linear-gradient(110deg,#7c6cf0 0%,#a78bfa 50%,#d8b4fe 100%)";

const MARQUEE_TEXT =
  "ART DIRECTOR OF THE STREETS • CREATIVE DESIGNER • DIGITAL ARTIST • ";

// ── Figure box sizing — single source of truth, shared by both the
// static figure layer and the spinning-globe layer below, so they
// stay pixel-locked to each other at every viewport size.
const FIGURE_BOX_WIDTH = "min(70vw, 100%)";

// ── Globe clip — verified via direct pixel analysis on the raw source
// (connected-component detection), then expanded to a true circle
// (diameter = larger of the bbox's width/height span) centered on the
// globe's actual center, so the spinning window shows the complete
// globe with no cropped edge and renders as a real circle (not an
// ellipse — using independent width%/height% on a non-square box
// would distort it, so size is height-driven + aspectRatio:1/1).
const GLOBE_CLIP = {
  top: "22.5%",
  left: "7.85%",
  diameter: "29.4%",
  // Closed-form background-size/position so this circular window
  // shows exactly the globe region of the full source image:
  //   ratio = (10000/diameter%) / 100
  //   pos%  = -offset% * ratio / (1 - ratio)
  bgSize: 340.14,
  bgPosX: 11.12,
  bgPosY: 31.87,
};

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const globeRef = useRef<HTMLDivElement>(null);

  // Subtle mouse-parallax on the globe only — figure + headline stay
  // completely static.
  useEffect(() => {
    const MAX = 6;
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
            FIGURE — single composite photo (figure + globe + card),
            rendered via background-image so its on-screen square box
            is explicit and reusable (next/image's `fill` + `contain`
            hides that square inside an opaque algorithm — we need it
            explicit so the spinning-globe layer below can match it
            exactly).
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute top-[-2%] right-0 bottom-0 flex items-end justify-end"
          style={{
            zIndex: 2,
            width: FIGURE_BOX_WIDTH,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        >
          {/* This div IS the rendered square (source is 1:1, so
              aspect-ratio:1/1 here exactly reproduces what
              object-fit:contain would have rendered). */}
          <div
            className="relative"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              minWidth: 0,
              aspectRatio: "1 / 1",
              transform: "translateX(4%)",
              backgroundImage: `url(${IMAGE_URL})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
            role="img"
            aria-label="The VINCE — illustrated figure holding a globe and a card reading VINCE"
          />
          {/* Hidden native img — hooks onLoad/onError for the reveal sequence */}
          <img
            src={IMAGE_URL}
            alt=""
            aria-hidden="true"
            className="absolute w-px h-px opacity-0 pointer-events-none"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            SPINNING GLOBE — cropped from the SAME image as the figure
            above, positioned in an identical box (same FIGURE_BOX_WIDTH,
            same anchor, same translateX) so it lands in the exact same
            pixels as the static globe underneath and occludes it purely
            through z-index — no patch, no second asset.
        ══════════════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          className="absolute top-[-2%] right-0 bottom-0 flex items-end justify-end pointer-events-none"
          style={{
            zIndex: 5,
            width: FIGURE_BOX_WIDTH,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          {/* Identical square to the figure's rendered box */}
          <div
            className="relative"
            style={{ maxWidth: "100%", maxHeight: "100%", minWidth: 0, aspectRatio: "1 / 1", transform: "translateX(4%)" }}
          >
            {/* Circular clip window — height-driven + aspectRatio:1/1
                guarantees a TRUE circle. top/left % are relative to
                this square, which equals the full source image 1:1
                with no letterboxing, so GLOBE_CLIP values map directly. */}
            <div
              ref={globeRef}
              className="absolute rounded-full overflow-hidden"
              style={{
                top: GLOBE_CLIP.top,
                left: GLOBE_CLIP.left,
                height: GLOBE_CLIP.diameter,
                width: "auto",
                aspectRatio: "1 / 1",
                animation: "globe-spin 13s linear infinite",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${IMAGE_URL})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${GLOBE_CLIP.bgSize}% ${GLOBE_CLIP.bgSize}%`,
                  backgroundPosition: `${GLOBE_CLIP.bgPosX}% ${GLOBE_CLIP.bgPosY}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TYPOGRAPHY ZONE
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
