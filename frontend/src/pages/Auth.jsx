import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { CORPUS_SIZE } from "../data/concepts";
import { EASE } from "../lib/motion";
import "./Auth.css";

const COPY = {
  login: {
    eyebrow: "Return visit",
    title: "Pick up where the itch left off.",
    action: "Sign in",
    pending: "Signing in",
    swapText: "No account yet?",
    swapLink: "Create one",
    swapTo: "/signup",
  },
  signup: {
    eyebrow: "First visit",
    title: "Open a file and start asking.",
    action: "Create account",
    pending: "Creating account",
    swapText: "Already have an account?",
    swapLink: "Sign in",
    swapTo: "/login",
  },
};

export default function Auth({ mode }) {
  const copy = COPY[mode];
  const isSignup = mode === "signup";
  const { login, signup, isLoggedIn, isChecking } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || "/chat";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm({ name: "", email: "", password: "" });
    setErrors({});
  }, [mode]);

  if (!isChecking && isLoggedIn) return <Navigate to={destination} replace />;

  const update = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  /* Mirrors the server's own rules so people are told before the round trip. */
  const check = () => {
    const found = {};
    if (isSignup && !form.name.trim()) found.name = "Enter the name you want to be called.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = "Enter a valid email address.";
    if (form.password.length < 6) found.password = "Use at least 6 characters.";
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy || !check()) return;

    setBusy(true);
    try {
      if (isSignup) {
        await signup(form.name.trim(), form.email.trim(), form.password);
        toast.success("Account created");
      } else {
        await login(form.email.trim(), form.password);
        toast.success("Signed in");
      }
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(error.message);
      setErrors((previous) => ({ ...previous, form: error.message }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth">
      <motion.div
        className="auth__panel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="display auth__title">{copy.title}</h1>

        <form className="auth__form" onSubmit={submit} noValidate>
          {isSignup && (
            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={update}
              error={errors.name}
              autoComplete="name"
            />
          )}

          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            error={errors.email}
            autoComplete="email"
          />

          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            error={errors.password}
            hint={isSignup ? "At least 6 characters." : undefined}
            autoComplete={isSignup ? "new-password" : "current-password"}
          />

          <button type="submit" className="btn auth__submit" disabled={busy}>
            {busy ? copy.pending : copy.action}
            {!busy && <FiArrowRight className="btn__arrow" aria-hidden="true" />}
          </button>
        </form>

        <p className="auth__swap">
          {copy.swapText}{" "}
          <Link to={copy.swapTo} state={location.state}>{copy.swapLink}</Link>
        </p>
      </motion.div>

      {/* The aside carries the honesty the product depends on, at full size. */}
      <aside className="auth__aside">
        <div className="auth__aside-inner">
          <p className="eyebrow eyebrow--veil">On the record</p>
          <p className="auth__quote">
            DermAI reads dermatology terminology and explains it. It does not
            diagnose, and it never replaces being looked at.
          </p>
          <dl className="auth__stats">
            <div>
              <dt className="code">Concepts indexed</dt>
              <dd>{CORPUS_SIZE.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="code">Source</dt>
              <dd>SNOMED CT</dd>
            </div>
            <div>
              <dt className="code">Retrieval</dt>
              <dd>Keyword + vector</dd>
            </div>
          </dl>
        </div>
      </aside>
    </section>
  );
}
