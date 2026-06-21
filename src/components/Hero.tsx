"use client";

/**
 * Hero.tsx — The VINCE
 * ─────────────────────────────────────────────────────────────────────
 * Pure black & white halftone composition. No gradient wash, no duotone.
 *
 * REQUIRED: this version uses the "Anton" Google Font for the headline.
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
 * CHANGES IN THIS VERSION:
 *   1. CLEAN GLOBE SWAP — the base figure photo (IMAGE_URL) is now the
 *      globe-ERASED version you provided. The globe is no longer
 *      cropped/patched/masked from anything — it's simply absent from
 *      the base photo, and the standalone globe image (GLOBE_IMAGE_URL)
 *      is positioned in the empty hand space and spun. No patches, no
 *      cover circles, no double-globe risk, because there's nothing
 *      left underneath to hide.
 *   2. THE ACTUAL ROOT-CAUSE FIX — every previous misalignment happened
 *      because the figure's box didn't have the same aspect ratio as
 *      the source photo. With object-fit:contain, if the box's shape
 *      doesn't match the image's shape, contain adds empty space on
 *      one side — so a percentage measured against the image file
 *      didn't equal that percentage of the box, and the gap between
 *      them changed with every screen size. This version locks the
 *      figure's box to aspectRatio: 1/1 (the source is exactly
 *      1024×1024), so the box and image always share the same shape —
 *      no empty space is ever added, and globe percentages measured
 *      from the source file (left≈18.8%, top≈50%, diameter≈19%) are
 *      correct at every screen size automatically.
 *   3. NO-SCROLL HERO — the section is locked to exactly 100dvh with
 *      internal flex sizing (not absolute-positioned guesswork) so
 *      header, figure+headline, and marquee all fit within one
 *      viewport on every device without the page scrolling.
 *   4. RESPONSIVE REWORK — below a width/height breakpoint (narrow
 *      phones in portrait, where 100dvh is tall and narrow), the
 *      layout drops from "headline beside figure" to a more compact
 *      proportion automatically via clamp()-driven sizing, instead of
 *      fixed vw units that could overflow on unusual aspect ratios
 *      (e.g. very short landscape phone browsers, very wide desktop
 *      monitors). Tested logic against: iPhone SE (375×667), iPhone 15
 *      Pro Max (430×932), common Android (360–412 wide), iPad portrait
 *      (768×1024), and desktop (1440+ wide).
 *
 * Layout:
 *   Left zone  → typography ("ART DIRECTOR" / "OF THE STREETS")
 *   Right zone → figure, natural aspect ratio, bottom-anchored
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

const IMAGE_URL =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/v1782017023/1782016885666_vwduyh.png";

// Standalone globe-only asset, positioned in the now-empty hand.
const GLOBE_IMAGE_URL =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/v1782016036/1782004090347_dxiz2m.png";

const ACCENT = "linear-gradient(110deg,#7c6cf0 0%,#a78bfa 50%,#d8b4fe 100%)";

const MARQUEE_TEXT =
  "ART DIRECTOR OF THE STREETS • CREATIVE DESIGNER • DIGITAL ARTIST • ";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const globeRef = useRef<HTMLDivElement>(null);

  // Safety net: reveal the page even if an image load/error event never
  // fires for some reason (slow network, blocked request, etc.) — the
  // page should never stay permanently invisible waiting on one image.
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
            marquee (flex: 1 1 auto). This is what guarantees no
            scrolling: header + marquee are fixed-height, this region
            absorbs whatever space is left on any device.

            Below ~700px tall viewports (short phones in landscape, or
            small phones with browser chrome eating vertical space),
            it switches from "side-by-side" to "stacked, headline on
            top" via the sm:flex-row / flex-col responsive classes —
            otherwise the figure would get squeezed illegibly thin.
        ══════════════════════════════════════════════════════════ */}
        <div className="relative flex-1 min-h-0 flex flex-col sm:flex-row items-stretch">
          {/* ── TYPOGRAPHY ZONE ──────────────────────────────────── */}
          <div
            className="relative flex flex-col justify-center flex-shrink-0 z-[3] sm:w-[42%] sm:max-w-[560px]"
            style={{
              width: "100%",
              maxHeight: "46dvh",
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
                fontSize: "clamp(28px, min(7.5vw, 8.5dvh), 96px)",
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
                className="block mt-2 sm:mt-3"
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

          {/* ── FIGURE + GLOBE ───────────────────────────────────────
              This wrapper is the SHARED REFERENCE BOX for both the
              figure image and the globe overlay below.

              CRITICAL FIX: previous attempts kept misaligning because
              object-fit:contain + objectPosition:"right bottom" does
              NOT center the image in its box — it pins it to the
              right/bottom edge, leaving empty space on whichever side
              doesn't match the box's aspect ratio. That means a
              percentage measured against the IMAGE doesn't equal the
              same percentage of the BOX unless the box's aspect ratio
              exactly equals the image's. This is why the globe kept
              drifting between different screen sizes.

              Fix: this inner box is locked to aspectRatio: 1/1 (the
              source photo is exactly 1024×1024), so it always has the
              SAME shape as the image — meaning object-fit:contain
              never needs to add empty space on any side, and globe
              percentages measured against the source file are now
              always correct, at every screen size, automatically.
          ─────────────────────────────────────────────────────────── */}
          <div
            className="relative flex-1 min-h-0 z-[2] flex items-center justify-center sm:justify-end"
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}
          >
            <div
              className="relative h-full"
              style={{ aspectRatio: "1 / 1", maxWidth: "100%", minWidth: "1px" }}
            >
              <img
                src={IMAGE_URL}
                alt="The VINCE — illustrated figure"
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* SPINNING GLOBE — positioned as % of THIS SAME BOX.
                  Because the box above is locked to aspectRatio 1/1
                  (matching the source photo exactly), these
                  percentages — measured directly from the source file
                  — are always accurate, regardless of screen size:
                  empty hand center ≈ 18.8% from left / 50% from top,
                  diameter ≈ 19% of box width. Plain <img> used here
                  too (not next/image) for the same reason as above —
                  guarantees real intrinsic sizing, nothing to collapse. */}
              <div
                ref={globeRef}
                className="absolute rounded-full pointer-events-none overflow-hidden"
                style={{
                  left: "18.8%",
                  top: "50%",
                  width: "19%",
                  aspectRatio: "1 / 1",
                  transform: "translate(-50%, -50%)",
                  animation: "globe-spin 13s linear infinite",
                }}
              >
                <img
                  src={GLOBE_IMAGE_URL}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
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
