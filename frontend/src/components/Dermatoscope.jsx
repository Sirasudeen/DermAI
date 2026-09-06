import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONCEPTS } from "../data/concepts";
import { useReducedMotion } from "../lib/motion";
import "./Dermatoscope.css";

/*
 * The signature element: a dermatoscope.
 *
 * The plate below is a procedural pigment network — the reticular mesh a
 * dermatologist actually looks for under polarised light. Move the lens across
 * it and the magnified layer resolves through a circular mask, naming whatever
 * finding sits underneath with its real SNOMED concept ID.
 *
 * Nothing here is a photograph of skin; the mesh is generated from a seeded
 * grid so it is stable between renders and carries no patient likeness.
 */

/* Mulberry32 — small, seeded, deterministic. */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1000;
const H = 640;

function buildNetwork() {
  const rand = seeded(20250406);
  const cols = 26;
  const rows = 17;
  const stepX = W / (cols - 1);
  const stepY = H / (rows - 1);

  const nodes = [];
  for (let y = 0; y < rows; y += 1) {
    const row = [];
    for (let x = 0; x < cols; x += 1) {
      row.push({
        x: x * stepX + (rand() - 0.5) * stepX * 0.62,
        y: y * stepY + (rand() - 0.5) * stepY * 0.62,
        r: 1.1 + rand() * 2.4,
      });
    }
    nodes.push(row);
  }

  const strands = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const from = nodes[y][x];
      const right = nodes[y][x + 1];
      const down = nodes[y + 1]?.[x];
      // A network line bows rather than running straight; skin has no rulers.
      if (right) {
        const mx = (from.x + right.x) / 2 + (rand() - 0.5) * 14;
        const my = (from.y + right.y) / 2 + (rand() - 0.5) * 14;
        strands.push(`M${from.x.toFixed(1)} ${from.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${right.x.toFixed(1)} ${right.y.toFixed(1)}`);
      }
      if (down) {
        const mx = (from.x + down.x) / 2 + (rand() - 0.5) * 14;
        const my = (from.y + down.y) / 2 + (rand() - 0.5) * 14;
        strands.push(`M${from.x.toFixed(1)} ${from.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${down.x.toFixed(1)} ${down.y.toFixed(1)}`);
      }
    }
  }

  return { nodes: nodes.flat(), path: strands.join(" ") };
}

/* Findings sit at fixed spots on the plate so the readout is repeatable. */
const FINDINGS = [
  { ...CONCEPTS[1], x: 22, y: 30, size: 15 },
  { ...CONCEPTS[4], x: 68, y: 24, size: 11 },
  { ...CONCEPTS[6], x: 45, y: 62, size: 13 },
  { ...CONCEPTS[9], x: 82, y: 68, size: 10 },
  { ...CONCEPTS[2], x: 12, y: 72, size: 12 },
];

export default function Dermatoscope() {
  const plateRef = useRef(null);
  const lensRef = useRef(null);
  const frameRef = useRef(0);
  const [reading, setReading] = useState(FINDINGS[0]);
  const [live, setLive] = useState(false);
  const reduced = useReducedMotion();
  const network = useMemo(buildNetwork, []);

  const place = useCallback((px, py) => {
    const plate = plateRef.current;
    if (!plate) return;
    plate.style.setProperty("--lx", `${px}%`);
    plate.style.setProperty("--ly", `${py}%`);

    let closest = FINDINGS[0];
    let best = Infinity;
    for (const finding of FINDINGS) {
      const distance = (finding.x - px) ** 2 + (finding.y - py) ** 2;
      if (distance < best) {
        best = distance;
        closest = finding;
      }
    }
    setReading((current) => (current.id === closest.id ? current : closest));
  }, []);

  const onPointerMove = useCallback(
    (event) => {
      if (event.pointerType === "touch") return;
      const rect = event.currentTarget.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => place(px, py));
      setLive(true);
    },
    [place]
  );

  /* With no pointer — or with motion turned down — the lens sweeps the
     findings on its own so the plate still explains itself. */
  useEffect(() => {
    if (live) return undefined;
    let index = 0;
    place(FINDINGS[0].x, FINDINGS[0].y);
    if (reduced) return undefined;
    const timer = setInterval(() => {
      index = (index + 1) % FINDINGS.length;
      place(FINDINGS[index].x, FINDINGS[index].y);
    }, 2600);
    return () => clearInterval(timer);
  }, [live, place, reduced]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return (
    <figure className="scope">
      <div
        className={`scope__plate${live ? " is-live" : ""}`}
        ref={plateRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setLive(false)}
      >
        <Plate network={network} />
        <div className="scope__magnified" aria-hidden="true">
          <Plate network={network} magnified />
        </div>

        {FINDINGS.map((finding) => (
          <span
            key={finding.id}
            className={`scope__mark${reading.id === finding.id ? " is-read" : ""}`}
            style={{
              left: `${finding.x}%`,
              top: `${finding.y}%`,
              "--mark-size": `${finding.size}%`,
            }}
          />
        ))}

        <div className="scope__lens" ref={lensRef} aria-hidden="true">
          <svg viewBox="0 0 100 100" className="scope__reticle">
            <circle cx="50" cy="50" r="47" className="scope__ring" />
            <circle cx="50" cy="50" r="41" className="scope__ring scope__ring--inner" />
            <path d="M50 18v10M50 72v10M18 50h10M72 50h10" className="scope__cross" />
            {Array.from({ length: 36 }, (_, i) => (
              <line
                key={i}
                x1="50" y1="4" x2="50" y2={i % 3 === 0 ? 10 : 7}
                className="scope__tick"
                transform={`rotate(${i * 10} 50 50)`}
              />
            ))}
          </svg>
        </div>
      </div>

      <figcaption className="scope__readout" aria-live="polite">
        <span className="scope__readout-label">Under the lens</span>
        <span className="scope__readout-term">{reading.term}</span>
        <span className="code scope__readout-id">SCTID {reading.id}</span>
      </figcaption>
    </figure>
  );
}

function Plate({ network, magnified = false }) {
  const id = magnified ? "mag" : "base";
  return (
    <svg
      className="scope__field"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="42%" r="72%">
          <stop offset="0%" stopColor="#5a4132" />
          <stop offset="58%" stopColor="#33231b" />
          <stop offset="100%" stopColor="#1d1310" />
        </radialGradient>
        <filter id={`skin-${id}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={magnified ? "0.012 0.02" : "0.03 0.05"}
            numOctaves="4"
            seed="7"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope={magnified ? "0.5" : "0.32"} />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#glow-${id})`} />
      <rect width={W} height={H} filter={`url(#skin-${id})`} opacity={magnified ? 0.55 : 0.38} />

      <g
        className="scope__network"
        transform={magnified ? `translate(${W / 2} ${H / 2}) scale(2.1) translate(${-W / 2} ${-H / 2})` : undefined}
      >
        <path
          d={network.path}
          fill="none"
          stroke={magnified ? "#d59757" : "#8a5f3c"}
          strokeWidth={magnified ? 1.5 : 1.3}
          strokeOpacity={magnified ? 0.85 : 0.58}
          strokeLinecap="round"
        />
        {network.nodes.map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={magnified ? "#e6b478" : "#7d5738"}
            fillOpacity={magnified ? 0.75 : 0.45}
          />
        ))}
      </g>
    </svg>
  );
}
