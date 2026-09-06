import { useMemo } from "react";

/* Film grain over the whole app. Generated once as a data URI so the dark
   ground never bands or looks like flat #000 fill. */
export default function Grain() {
  const src = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
      <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/></filter>
      <rect width="220" height="220" filter="url(#n)" opacity="0.55"/>
    </svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, []);

  return <div className="grain" style={{ "--grain-src": src }} aria-hidden="true" />;
}
