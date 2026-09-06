import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="lost shell">
      <p className="eyebrow">No such record</p>
      <h1 className="display lost__title">Nothing at this address.</h1>
      <p className="prose lost__body">
        The page you asked for is not part of DermAI. Head back to the overview,
        or go straight to your conversation.
      </p>
      <div className="lost__actions">
        <Link to="/" className="btn">Back to overview</Link>
        <Link to="/chat" className="btn btn--ghost">Open the assistant</Link>
      </div>
    </section>
  );
}
