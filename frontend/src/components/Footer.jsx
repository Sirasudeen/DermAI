import { Link } from "react-router-dom";
import { CORPUS_SIZE } from "../data/concepts";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="shell foot__inner">
        <div className="foot__col">
          <p className="eyebrow">DermAI</p>
          <p className="foot__note">
            A reading assistant for skin questions, grounded in{" "}
            {CORPUS_SIZE.toLocaleString()} SNOMED&nbsp;CT dermatology concepts.
          </p>
        </div>

        <nav className="foot__col foot__links" aria-label="Footer">
          <Link to="/">Overview</Link>
          <Link to="/features">What it does</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/signup">Create an account</Link>
        </nav>

        <p className="foot__col foot__warn">
          DermAI is not a doctor and does not diagnose. Anything that bleeds,
          changes shape, or will not settle belongs in front of a clinician.
        </p>
      </div>

      <div className="shell foot__base">
        <span className="code">SNOMED CT · hybrid BM25 + vector retrieval</span>
        <span className="code">Built as a student project</span>
      </div>
    </footer>
  );
}
