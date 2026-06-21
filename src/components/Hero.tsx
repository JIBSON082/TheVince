"use client";

/**
 * Hero.tsx — The VINCE
 * ─────────────────────────────────────────────────────────────────────
 * Pure black & white halftone composition. No gradient wash, no duotone.
 *
 * Layout:
 *   Left ~42%  → typography zone ("ART DIRECTOR" / "OF THE STREETS")
 *   Right ~64% → figure (horizontally cropped source), bleeding off
 *                the right edge
 *
 * The source image is square, but the figure's body and the globe
 * both sit left-of-center within it. A horizontal crop (see CROP_BOX)
 * is applied so that, once the figure box is positioned at 64vw wide
 * anchored right, the globe's left edge naturally lands right at the
 * typography zone's boundary — without that crop, the geometry can't
 * satisfy "figure occupies ~62% of frame" and "globe touches the type
 * zone" at the same time (verified by direct calculation).
 *
 * Key detail: the globe sits at z5 — above the figure (z2) and above
 * the headline (z3) — so it visually interrupts "OF THE STREETS"
 * exactly where the two overlap.
 *
 * The globe gets independent motion via a masked clone technique:
 * a second copy of the same image, clipped to a circle around the
 * globe's known position (GLOBE_CLIP, measured by pixel analysis),
 * is given its own slow rotation — so it reads as "spinning" while
 * the rest of the figure stays static.
 *
 * Bottom chrome: infinite marquee strip, fully separated from the
 * headline (no overlap with the main composition).
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

// ── Source image ────────────────────────────────────────────────────
const IMAGE_URL =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/v1781999577/1781997692098_aawdh2.png";

// ── Crop applied to the figure box ──────────────────────────────────
// The source is a square (1024×1024) image, but the man's body only
// occupies x[23.3–75.2]% of it, and the globe sits further left at
// x[12.5–32.6]%. To satisfy "globe touches the type-zone boundary"
// AND "figure occupies the right 60–65%" simultaneously, the figure
// box uses a horizontal crop (not the full square) — keeping full
// height, cropped to x[11–76.7]% — which pulls the globe's left edge
// to sit right at the type zone boundary once the box is positioned.
const CROP_BOX = {
  aspect: 0.6570, // width/height of the cropped frame
  bgSizeW: 152.21,
  bgSizeH: 100,
  bgPosX: 32.07,
  bgPosY: 0,
};

// ── Globe position — relative to the CROPPED figure box ─────────────
// The clip window is sized by HEIGHT only (29.4% of box height, which
// is correct since the crop never touched the vertical axis) with
// aspectRatio:1/1 forcing width to match in rendered pixels. This is
// required because the crop box itself isn't square (aspect 0.657),
// so using independent width%/height% would render an ellipse, not
// a circle — caught and fixed before shipping.
const GLOBE_CLIP = {
  top: "22.5%",
  left: "-4.79%",
  height: "29.4%",
  // backgroundSize/Position reference the ORIGINAL full image (the
  // clone's background-image is the untouched source url), recomputed
  // for a true circular window centered on the globe.
  bgSize: 340.14,
  bgPosX: 11.12,
  bgPosY: 31.87,
};

// ── Single accent dot gradient (kept from existing pattern) ─────────
const ACCENT = "linear-gradient(110deg,#7c6cf0 0%,#a78bfa 50%,#d8b4fe 100%)";

const MARQUEE_TEXT =
  "ART DIRECTOR OF THE STREETS • CREATIVE DESIGNER • DIGITAL ARTIST • ";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const globeWrapRef = useRef<HTMLDivElement>(null);

  const handleImageReady = () => setLoaded(true);

  // ── Subtle mouse-parallax on the globe clone only ──────────────────
  // Figure + headline stay completely static, per spec.
  useEffect(() => {
    const MAX = 10;
    const onMove = (e: MouseEvent) => {
      if (!globeWrapRef.current) return;
      const dx =
        ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * MAX;
      const dy =
        ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * MAX;
      globeWrapRef.current.style.setProperty("--parallax-x", `${dx}px`);
      globeWrapRef.current.style.setProperty("--parallax-y", `${dy}px`);
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
          0%   { transform: translate(var(--parallax-x,0), var(--parallax-y,0)) rotate(0deg); }
          100% { transform: translate(var(--parallax-x,0), var(--parallax-y,0)) rotate(360deg); }
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
            FIGURE — width-driven box at 64vw, height follows from a
            horizontal crop of the source (x:11–76.7%, full height).
            This crop pulls the globe leftward within its own box just
            enough that, once positioned, its left edge reaches the
            typography zone boundary — see CROP_BOX comment above.
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute top-0 right-0 bottom-0 flex items-end justify-end"
          style={{
            zIndex: 2,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        >
          {/* Width = max(64vw, height-driven width) — guarantees the box
              always fills the full section height even on narrow/tall
              viewports (mobile portrait, tablet), where 64vw alone would
              leave a visible gap above the figure. On wide viewports,
              64vw wins and the box overflows height (cropped at top by
              the section's overflow:hidden) — the intended bleed look. */}
          <div
            className="relative"
            style={{
              width: `max(64vw, calc(100dvh * ${CROP_BOX.aspect}))`,
              aspectRatio: CROP_BOX.aspect,
              transform: "translateX(3%)",
              backgroundImage: `url(${IMAGE_URL})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${CROP_BOX.bgSizeW}% ${CROP_BOX.bgSizeH}%`,
              backgroundPosition: `${CROP_BOX.bgPosX}% ${CROP_BOX.bgPosY}%`,
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
            onLoad={handleImageReady}
            onError={handleImageReady}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            GLOBE CLONE — masked, independently spinning layer.
            Lives inside a box identical to the figure's (same crop,
            same width, same translateX), so GLOBE_CLIP percentages
            map exactly onto the figure's globe with no drift.
            Sits at z5 — above the figure (z2) and the headline (z3) —
            which is what makes it visually "interrupt" the second line.
        ══════════════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 bottom-0 flex items-end justify-end pointer-events-none"
          style={{
            zIndex: 5,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          {/* Identical box to the figure above — same width, same aspect
              ratio, same translateX — so GLOBE_CLIP percentages (measured
              against this cropped frame) line up exactly. */}
          <div
            className="relative"
            style={{
              width: `max(64vw, calc(100dvh * ${CROP_BOX.aspect}))`,
              aspectRatio: CROP_BOX.aspect,
              transform: "translateX(3%)",
            }}
          >
            {/* Circular clip window — height-driven + aspectRatio:1/1
                guarantees a TRUE circle (not an ellipse) regardless of
                the parent box's own aspect ratio. */}
            <div
              ref={globeWrapRef}
              className="absolute rounded-full"
              style={{
                top: GLOBE_CLIP.top,
                left: GLOBE_CLIP.left,
                height: GLOBE_CLIP.height,
                width: "auto",
                aspectRatio: "1 / 1",
                backgroundImage: `url(${IMAGE_URL})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${GLOBE_CLIP.bgSize}% ${GLOBE_CLIP.bgSize}%`,
                backgroundPosition: `${GLOBE_CLIP.bgPosX}% ${GLOBE_CLIP.bgPosY}%`,
                animation: "globe-spin 14s linear infinite",
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TYPOGRAPHY ZONE — left ~38–40%
            Two stacked lines. The globe clone (z5) sits above this
            zone's z-index (z3) only where it physically overlaps —
            its left edge lands right at this zone's right boundary,
            so it reads as cutting into "OF THE STREETS".
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute top-0 left-0 bottom-0 flex flex-col justify-center"
          style={{ width: "42%", zIndex: 3, paddingLeft: "5%", paddingRight: "2%" }}
        >
          <h1
            className="text-black uppercase"
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(34px, 7.4vw, 92px)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            <span
              className="block"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s",
              }}
            >
              ART
              <br />
              DIRECTOR
            </span>

            {/* "OF THE STREETS" — sits at z3, globe clone is z5 above it */}
            <span
              className="block"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s",
              }}
            >
              OF THE
              <br />
              STREETS
            </span>
          </h1>
        </div>

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
            BOTTOM MARQUEE — fully separated from headline/figure
        ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute left-0 right-0 bottom-0 overflow-hidden bg-[#f2f0ea] border-t border-black/10"
          style={{ zIndex: 9, height: "44px", ...revealUp("1s") }}
        >
          {/* Two identical tracks, each repeated 8× — wide enough to
              fully cover ultra-wide viewports (tested up to 2560px) with
              no gap before the loop point. Animating to -50% slides
              exactly one track's width, landing seamlessly on the
              second copy's start. */}
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
