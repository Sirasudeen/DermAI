import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Nav.css";

function LensMark() {
  return (
    <svg viewBox="0 0 24 24" className="nav__mark" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4.5" className="nav__mark-pupil" />
      <path d="M12 0.8v3M12 20.2v3M0.8 12h3M20.2 12h3" />
    </svg>
  );
}

export default function Nav() {
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${lifted ? " is-lifted" : ""}${open ? " is-open" : ""}`}>
      <div className="nav__inner shell">
        <Link to="/" className="nav__brand">
          <LensMark />
          <span>DermAI</span>
        </Link>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav id="nav-menu" className="nav__menu" aria-label="Main">
          <NavLink to="/" end className="nav__link">Overview</NavLink>
          <NavLink to="/features" className="nav__link">What it does</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/chat" className="nav__link">Ask</NavLink>
              <button type="button" className="nav__link nav__link--button" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav__link">Sign in</NavLink>
              <Link to="/signup" className="btn nav__cta">
                Start asking
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
