import Hero from "@/components/Hero";

/**
 * index.tsx — Home page
 *
 * Only <Hero /> renders now.
 * As each section is built, import it here and add it below.
 *
 * ── TO ADD A NEW SECTION ─────────────────────────────────────
 *   1. Build the component in src/components/
 *   2. Import it below the existing imports
 *   3. Add <ComponentName /> inside the <> fragment below Hero
 *   4. Push to GitHub → Vercel auto-deploys
 * ─────────────────────────────────────────────────────────────
 *
 * Future imports (uncomment as each file is created):
 *   import Navbar       from "@/components/Navbar";
 *   import OurStory     from "@/components/OurStory";
 *   import Menu         from "@/components/Menu";
 *   import Testimonials from "@/components/Testimonials";
 *   import Contact      from "@/components/Contact";
 */
export default function Home() {
  return (
    <>
      <Hero />

      {/*
        <OurStory />
        <Menu />
        <Testimonials />
        <Contact />
      */}
    </>
  );
}

