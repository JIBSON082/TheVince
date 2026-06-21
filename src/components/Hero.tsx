"use client";

/**
 * Hero.tsx — The VINCE
 * ─────────────────────────────────────────────────────────────────────
 * Pure black & white halftone composition. No gradient wash, no duotone.
 *
 * REQUIRED: Anton Google Font for the headline. Add to <head> in your
 * root layout (RootLayout.tsx):
 *
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
 *
 * ─────────────────────────────────────────────────────────────────────
 * REBUILT FROM SCRATCH — simplified per direction:
 *   1. ONE static image only (the original combined photo — man, globe,
 *      and VINCE card all in one). No second globe asset, no spinning
 *      crop, no rotation, no z-index layering tricks. The globe in the
 *      photo is simply part of the picture, same as everything else.
 *   2. STACKED LAYOUT — headline on top, image below it, matching the
 *      reference layout exactly: not side-by-side, top-to-bottom.
 *   3. NO SCROLL — section locked to 100dvh, real flex sizing (header
 *      fixed height, body flex-1, marquee fixed height) so it always
 *      fits exactly one screen.
 *   4. Plain <img> tags (not next/image) with fully explicit sizing —
 *      this was the fix for a real bug we hit earlier where ambiguous
 *      sizing caused the image box to collapse to zero height on some
 *      devices.
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";

const IMAGE_URL =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/v1781999577/1781997692098_aawdh2.png";

const ACCENT = "linear-gradient(110deg,#7c6cf0 0%,#a78bfa 50%,#d8b4fe 100%)";

const MARQUEE_TEXT =
  "ART DIRECTOR OF THE STREETS • CREATIVE DESIGNER • DIGITAL ARTIST • ";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  // Safety net: reveal the page even if the image load/error event
  // never fires (slow network, blocked request) — the page should
  // never stay permanently invisible waiting on one image.
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
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
        className="relative w-full overflow-hidden bg-[#f2f0ea] flex flex-col"
        style={{ height: "100dvh", minHeight: "480px" }}
      >
        {/* ══════════════════════════════════════════════════════════
            TOP BAR — fixed height, never grows
        ══════════════════════════════════════════════════════════ */}
        <header
          className="flex justify-between items-center px-5 sm:px-6 flex-shrink-0"
          style={{
            zIndex: 9,
            height: "clamp(44px, 7dvh, 64px)",
            ...revealDown("0.05s"),
          }}
        >
          <span
            className="text-black/70 text-[9px] sm:text-[10.5px] tracking-[0.09em] uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            © Design by The VINCE
          </span>

          <button
            aria-label="Open navigation menu"
            className="flex items-center gap-2 text-black/70 text-[9px] sm:text-[10.5px] tracking-[0.09em] uppercase bg-transparent border-0 cursor-pointer hover:opacity-100 transition-opacity duration-200"
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
            MAIN BODY — fills all remaining height between header and
            marquee. Stacked: headline first, image below, matching
            the reference layout (not side-by-side).
        ══════════════════════════════════════════════════════════ */}
        <div className="relative flex-1 min-h-0 flex flex-col">
          {/* ── HEADLINE ──────────────────────────────────────────── */}
          <div
            className="flex-shrink-0"
            style={{
              paddingLeft: "5.5%",
              paddingRight: "4%",
              paddingTop: "1.5dvh",
              paddingBottom: "1dvh",
            }}
          >
            <h1
              className="text-black uppercase"
              style={{
                fontFamily: "'Anton', 'Archivo Black', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(28px, min(8.5vw, 6.5dvh), 80px)",
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
                className="block mt-1 sm:mt-2"
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

          {/* ── IMAGE — fills remaining space below the headline,
              single static photo, no rotation, no overlays. ────── */}
          <div
            className="relative flex-1 min-h-0 flex items-end justify-end"
            style={{
              paddingRight: "2%",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={IMAGE_URL}
                alt="The VINCE — illustrated figure holding a globe and a card reading VINCE"
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "right bottom",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            BOTTOM MARQUEE — fixed height, never grows
        ══════════════════════════════════════════════════════════ */}
        <div
          className="relative flex-shrink-0 overflow-hidden bg-[#f2f0ea] border-t border-black/10 z-[9]"
          style={{ height: "clamp(34px, 5.5dvh, 44px)", ...revealUp("1s") }}
        >
          <div
            className="flex items-center h-full whitespace-nowrap"
            style={{ animation: "marquee-scroll 34s linear infinite" }}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                className="text-black/80 text-[9px] sm:text-[10px] tracking-[0.18em] uppercase px-4 flex-shrink-0"
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
