import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowUp, FiTrash2 } from "react-icons/fi";
import Message from "../components/Message";
import { useAuth } from "../context/AuthContext";
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator";
import { COMPLAINTS } from "../data/concepts";
import { EASE } from "../lib/motion";
import "./Chat.css";

const OPENERS = COMPLAINTS.slice(0, 4);

function Thinking() {
  return (
    <motion.div
      className="thinking"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <span className="thinking__dots" aria-hidden="true">
        <i /><i /><i />
      </span>
      <span className="code thinking__label">Searching the terminology</span>
    </motion.div>
  );
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [draft, setDraft] = useState("");

  const streamRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let active = true;
    getUserChats()
      .then((data) => {
        if (active) setMessages(data?.chats ?? []);
      })
      .catch((error) => {
        if (active) toast.error(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useLayoutEffect(() => {
    const stream = streamRef.current;
    if (stream) stream.scrollTop = stream.scrollHeight;
  }, [messages, pending]);

  const grow = useCallback(() => {
    const field = inputRef.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 220)}px`;
  }, []);

  const send = useCallback(
    async (text) => {
      const content = text.trim();
      if (!content || pending) return;

      setDraft("");
      requestAnimationFrame(grow);
      setMessages((previous) => [...previous, { role: "user", content }]);
      setPending(true);

      try {
        const data = await sendChatRequest(content);
        if (!data?.chats) throw new Error("The assistant returned an empty reply.");
        setMessages(data.chats);
      } catch (error) {
        toast.error(error.message);
        // Put the text back rather than losing what they typed.
        setMessages((previous) => previous.slice(0, -1));
        setDraft(content);
      } finally {
        setPending(false);
      }
    },
    [pending, grow]
  );

  const clear = useCallback(async () => {
    setConfirmClear(false);
    const snapshot = messages;
    setMessages([]);
    try {
      await deleteUserChats();
      toast.success("Conversation cleared");
    } catch (error) {
      setMessages(snapshot);
      toast.error(error.message);
    }
  }, [messages]);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const empty = !loading && messages.length === 0 && !pending;

  return (
    <div className="chat">
      <aside className="chat__rail">
        <div className="chat__who">
          <span className="chat__avatar" aria-hidden="true">
            {firstName.charAt(0).toUpperCase()}
          </span>
          <span className="chat__who-text">
            <span className="chat__name">{user?.name}</span>
            <span className="code chat__email">{user?.email}</span>
          </span>
        </div>

        <p className="chat__rail-note">
          Answers are written from SNOMED&nbsp;CT dermatology concepts retrieved
          for your question. This is not a diagnosis.
        </p>

        <div className="chat__rail-foot">
          {confirmClear ? (
            <div className="chat__confirm">
              <p className="chat__confirm-text">
                Clear the whole conversation? This cannot be undone.
              </p>
              <div className="chat__confirm-actions">
                <button type="button" className="chat__danger" onClick={clear}>
                  Clear it
                </button>
                <button
                  type="button"
                  className="chat__quiet"
                  onClick={() => setConfirmClear(false)}
                >
                  Keep it
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="chat__quiet chat__clear"
              onClick={() => setConfirmClear(true)}
              disabled={messages.length === 0}
            >
              <FiTrash2 aria-hidden="true" />
              Clear conversation
            </button>
          )}
        </div>
      </aside>

      <main className="chat__main">
        <div className="chat__stream" ref={streamRef}>
          <div className="chat__column">
            {empty ? (
              <motion.div
                className="chat__empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <p className="eyebrow">Presenting complaint</p>
                <h1 className="display chat__empty-title">
                  What is going on, {firstName}?
                </h1>
                <p className="prose chat__empty-body">
                  Describe it however it comes out. Where it is, how long it has
                  been there, what it feels like. Plain words are enough.
                </p>

                <ul className="openers">
                  {OPENERS.map((opener) => (
                    <li key={opener}>
                      <button type="button" className="opener" onClick={() => send(opener)}>
                        <span className="opener__text">“{opener}”</span>
                        <FiArrowUp className="opener__icon" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <div className="chat__messages">
                {messages.map((message, index) => (
                  <Message
                    key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                <AnimatePresence>{pending && <Thinking />}</AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
        >
          <div className="composer__inner">
            <label className="sr-only" htmlFor="chat-input">Your question</label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              className="composer__input"
              placeholder="Describe what you are seeing…"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                grow();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(draft);
                }
              }}
            />
            <button
              type="submit"
              className="composer__send"
              disabled={pending || !draft.trim()}
              aria-label="Send question"
            >
              <FiArrowUp aria-hidden="true" />
            </button>
          </div>
          <p className="composer__hint code">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </main>
    </div>
  );
}
