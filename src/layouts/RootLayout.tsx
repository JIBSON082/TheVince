import type { ReactNode } from "react";

/**
 * RootLayout.tsx
 * A reusable layout wrapper. Wrap any page component with this
 * if you need consistent padding, max-width, or shared UI.
 *
 * Currently a pass-through — add a <Navbar /> here later
 * so it appears on every page that uses this layout.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#090909] text-[#f0ece2]">
      {/* <Navbar /> — import and uncomment when Navbar.tsx is ready */}
      {children}
      {/* <Footer /> — import and uncomment when Footer.tsx is ready */}
    </div>
  );
}

