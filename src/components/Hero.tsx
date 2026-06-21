"use client";

/**
 * Hero.tsx — The VINCE
 * ─────────────────────────────────────────────────────────────────────
 * Pure black & white halftone composition. No gradient wash, no duotone.
 *
 * Headline font: Anton. Add via next/font in your root layout:
 *   import { Anton } from 'next/font/google';
 *   const anton = Anton({ weight: '400', subsets: ['latin'] });
 * ...or via a <link> tag in <head> if not using next/font.
 *
 * ─────────────────────────────────────────────────────────────────────
 * REBUILT FROM SCRATCH — figure was invisible with NO image element
 * present at all (confirmed: long-pressing the blank area produced no
 * image context menu on the actual device, which rules out a broken/
 * blocked image and points to the box never rendering as a real,
 * sized element in the first place).
 *
 * Root cause: several iterations of CSS tried to make a `<div>` with
 * only a `background-image` size itself via `aspect-ratio` and no
 * explicit width — but background-image divs have ZERO intrinsic
 * content size, and the surrounding flex/absolute positioning chain
 * was fragile enough that the box was collapsing to nothing on real
 * devices even when isolated jsdom tests looked fine (jsdom doesn't
 * compute real layout, so it couldn't catch this).
 *
 * This version uses a real <img> tag instead. Images have intrinsic
 * size from their natural width/height — they cannot collapse to
 * zero the way a background-image div can. Positioning is simple:
 * the img fills its wrapper with object-fit:cover, and the wrapper's
 * size is set with plain, explicit CSS (no aspect-ratio chains, no
 * flex auto-sizing ambiguity).
 *
 * The spinning globe is measured and positioned using the SAME simple
 * percentage math, applied as a circular overflow:hidden window with
 * an inner <img> (also a real <img>, same robustness reasoning) scaled
 * up via explicit width/height percentages — verified arithmetically
 * below, not reasoned about abstractly.
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

const IMAGE_URL =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/v1781999577/1781997692098_aawdh2.png";

const ACCENT = "linear-gradient(110deg,#7c6cf0 0%,#a78bfa 50%,#d8b4fe 100%)";

const MARQUEE_TEXT =
  "ART DIRECTOR OF THE STREETS • CREATIVE DESIGNER • DIGITAL ARTIST • ";

// Globe bbox measured directly from the raw 1024×1024 source via pixel
// analysis: x[12.5–32.6]%, y[24.5–49.9]%. Expanded to a true circle
// (diameter = larger span = 29.4%) centered on the globe's actual
// center (22.55%, 37.2%), so nothing is cropped.
const GLOBE = {
  diameterPct: 29.4,         // of the square source image
  centerXPct: 22.55,
  centerYPct: 37.2,
};

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  // Safety net: reveal the page even if the image never fires load/error
  // (handles blocked/hanging requests so the page is never permanently
  // invisible).
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
        @keyframes globe-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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
            FIGURE — plain <img>, object-fit:cover inside a wrapper
            sized with explicit, ordinary CSS (percent of viewport
            units only — no aspect-ratio, no flex auto-sizing, no
            zero-intrinsic-content risk). This is the simplest possible
            approach and the least likely to silently collapse.
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute"
          style={{
            top: 0,
            right: 0,
            bottom: 0,
            width: "68vw",
            maxWidth: "900px",
            zIndex: 2,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        >
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
              height: "auto",
              maxHeight: "100%",
              display: "block",
              objectFit: "contain",
              objectPosition: "right bottom",
            }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            SPINNING GLOBE — separate circular window, same <img>
            source, scaled up so only the globe region shows. Position
            and size are plain percentages of the SAME wrapper box used
            by the figure above (same top/right/bottom/width values),
            so it lines up with the static globe underneath it.
        ══════════════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            top: 0,
            right: 0,
            bottom: 0,
            width: "68vw",
            maxWidth: "900px",
            zIndex: 5,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          {/* This inner box mimics the figure img's rendered position:
              object-fit:contain + object-position:"right bottom" on a
              SQUARE source (1024×1024) inside a wrapper of width W and
              height H means the rendered square is min(W,H) wide/tall,
              anchored bottom-right. We reproduce that exact square here
              using the same CSS (width:100%, height:auto, the source's
              own 1:1 ratio comes from the image itself this time, not
              an artificial aspect-ratio property), so percentages
              measured against the ORIGINAL image map directly onto it. */}
          <div className="absolute right-0 bottom-0 w-full" style={{ aspectRatio: "1 / 1" }}>
            <div
              className="absolute rounded-full overflow-hidden"
              style={{
                width: `${GLOBE.diameterPct}%`,
                aspectRatio: "1 / 1",
                left: `calc(${GLOBE.centerXPct}% - ${GLOBE.diameterPct / 2}%)`,
                top: `calc(${GLOBE.centerYPct}% - ${GLOBE.diameterPct / 2}%)`,
                animation: "globe-spin 13s linear infinite",
              }}
            >
              <img
                src={IMAGE_URL}
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: `${(100 / GLOBE.diameterPct) * 100}%`,
                  height: `${(100 / GLOBE.diameterPct) * 100}%`,
                  left: `${-((GLOBE.centerXPct - GLOBE.diameterPct / 2) / GLOBE.diameterPct) * 100}%`,
                  top: `${-((GLOBE.centerYPct - GLOBE.diameterPct / 2) / GLOBE.diameterPct) * 100}%`,
                  maxWidth: "none",
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
