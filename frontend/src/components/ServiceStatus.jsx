import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pingService, readService, watchService } from "../helpers/api-communicator";
import { EASE } from "../lib/motion";
import "./ServiceStatus.css";

const ARMED_KEY = "dermai.watch-service";
const RETRY_MS = 30000;
/* Narrow screens get the collapsed bar, so the notice never sits on top of the
   hero's own call to action. */
const COMPACT_WIDTH = 560;

function readArmed() {
  try {
    return localStorage.getItem(ARMED_KEY) === "1";
  } catch {
    return false;
  }
}

/*
 * The tag only claims what it can deliver: it watches the service itself and
 * clears the moment a request comes back, rather than promising a message from
 * somewhere else. Nothing is collected to make that work.
 */
export default function ServiceStatus() {
  const reachable = useSyncExternalStore(watchService, readService, () => null);
  const [armed, setArmed] = useState(readArmed);
  const [checking, setChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth > COMPACT_WIDTH
  );

  const down = reachable === false && !dismissed;

  const recheck = useCallback(async () => {
    setChecking(true);
    await pingService();
    setChecking(false);
  }, []);

  /* While it is down, keep testing quietly so the tag can retire itself. */
  useEffect(() => {
    if (reachable !== false) return undefined;
    const timer = setInterval(() => {
      pingService();
    }, RETRY_MS);
    return () => clearInterval(timer);
  }, [reachable]);

  const arm = useCallback(() => {
    setArmed(true);
    try {
      localStorage.setItem(ARMED_KEY, "1");
    } catch {
      /* Private browsing — the watcher still runs for this visit. */
    }
    recheck();
  }, [recheck]);

  return (
    <AnimatePresence>
      {down && (
        <motion.aside
          className="status"
          role="status"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="status__head">
            <span className="status__dot" aria-hidden="true" />
            <button
              type="button"
              className="code status__tag"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
            >
              Service dormant
            </button>
            <button
              type="button"
              className="status__close"
              onClick={() => setDismissed(true)}
              aria-label="Hide this notice"
            >
              ×
            </button>
          </div>

          {open && (
            <>
            <p className="status__body">
              The assistant has had no traffic for a long stretch, so it is not
              answering right now. Everything else on the page still works.
            </p>

            {armed ? (
              <p className="status__armed">
                <span className="code status__armed-tag">Watching</span>
                This notice clears itself the moment the service answers again.
              </p>
            ) : (
              <button type="button" className="status__notify" onClick={arm}>
                Notify me when it is back
              </button>
            )}

            <button
              type="button"
              className="status__retry"
              onClick={recheck}
              disabled={checking}
            >
              {checking ? "Checking…" : "Check again now"}
            </button>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
