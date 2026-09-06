import "./Aperture.css";

/* Loading state, drawn as a lens iris rather than a spinner — same instrument
   the hero uses, so waiting still looks like the product. */
export default function Aperture({ label = "Loading" }) {
  return (
    <div className="aperture" role="status">
      <svg viewBox="0 0 60 60" className="aperture__iris" aria-hidden="true">
        <circle cx="30" cy="30" r="26" className="aperture__rim" />
        {Array.from({ length: 6 }, (_, i) => (
          <path
            key={i}
            d="M30 6 A24 24 0 0 1 50.8 18"
            className="aperture__blade"
            style={{ transform: `rotate(${i * 60}deg)`, animationDelay: `${i * 0.11}s` }}
          />
        ))}
      </svg>
      <p className="aperture__label code">{label}</p>
    </div>
  );
}
