import type { AppProps } from "next/app";
import "@/styles/globals.css";

/**
 * _app.tsx — Next.js Pages Router entry point
 * Imports global styles. Add providers (fonts, analytics, etc.) here.
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

