import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Dermatoscope from "../components/Dermatoscope";
import Reveal from "../components/Reveal";
import Magnetic from "../components/Magnetic";
import { CONCEPTS, COMPLAINTS, CORPUS_SIZE } from "../data/concepts";
import { EASE } from "../lib/motion";
import "./Home.css";

/* The page is laid out as a clinical note: complaint, examination, impression,
   advice. Those four headings are the real vernacular of the subject, and each
   one genuinely describes what its section does. */

function Headline({ text }) {
  const words = text.split(" ");
  return (
    <h1 className="display hero__title">
      {words.map((word, index) => (
        <span className="hero__word" key={`${word}-${index}`}>
          <motion.span
            className="hero__word-inner"
            initial={{ y: "125%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 + index * 0.07 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

function Ticker() {
  const run = [...CONCEPTS, ...CONCEPTS];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {run.map((concept, index) => (
          <span className="ticker__item" key={`${concept.id}-${index}`}>
            <span className="ticker__id">{concept.id}</span>
            <span className="ticker__term">{concept.term}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const EXAM = [
  {
    step: "01",
    title: "You describe it in your own words",
    body: "No terminology required. “The patch behind my knee has been flaking for three weeks” is a usable question.",
  },
  {
    step: "02",
    title: "Two searches run over the terminology",
    body: "Keyword matching catches the exact term you happened to use. A SapBERT vector search catches the term you meant. Their scores are merged, weighted toward meaning.",
  },
  {
    step: "03",
    title: "The answer is written from what came back",
    body: "The model only writes from the concepts retrieved for your question. When nothing relevant comes back, it says so instead of inventing something.",
  },
];

const IMPRESSION = [
  {
    label: "Plain language",
    title: "Clinical terms, translated",
    body: "Every answer explains the vocabulary it uses, so you leave knowing what to type into a form or say to a pharmacist.",
  },
  {
    label: "Traceable",
    title: "Grounded in a real terminology",
    body: `Retrieval runs over ${CORPUS_SIZE.toLocaleString()} SNOMED CT dermatology concepts and their definitions — not scraped forum posts.`,
  },
  {
    label: "Continuous",
    title: "The thread stays with you",
    body: "Your conversation is saved to your account, so you can come back in a week and pick up where the itch left off.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__lede">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Presenting complaint
            </motion.p>

            <Headline text="Look closer at what your skin is doing." />

            <motion.p
              className="prose hero__prose"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            >
              Ask about a rash, a mole, or a word a doctor used, in whatever
              words you have. DermAI reads your question against{" "}
              <em>{CORPUS_SIZE.toLocaleString()} SNOMED&nbsp;CT dermatology
              concepts</em> and answers from what it finds there.
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
            >
              <Magnetic>
                <Link to="/signup" className="btn">
                  Ask a question
                  <FiArrowRight className="btn__arrow" aria-hidden="true" />
                </Link>
              </Magnetic>
              <Link to="/features" className="btn btn--ghost">
                See how it reads
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="hero__scope"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
          >
            <Dermatoscope />
            <p className="hero__hint code">Move across the plate to examine it</p>
          </motion.div>
        </div>

        <Ticker />
      </section>

      <section className="section" id="complaints">
        <div className="shell section__head">
          <Reveal as="p" className="eyebrow">History</Reveal>
          <Reveal as="h2" className="display section__title" delay={0.05}>
            Nobody arrives knowing the right word.
          </Reveal>
        </div>

        <div className="shell">
          <ul className="complaints">
            {COMPLAINTS.map((line, index) => (
              <Reveal as="li" key={line} className="complaints__item" delay={index * 0.04}>
                <span className="complaints__quote">“{line}”</span>
              </Reveal>
            ))}
          </ul>
          <Reveal as="p" className="prose complaints__foot" delay={0.1}>
            All eight of those are answerable. The terminology is the assistant’s
            problem, not yours.
          </Reveal>
        </div>
      </section>

      <section className="section" id="examination">
        <div className="shell section__head">
          <Reveal as="p" className="eyebrow">Examination</Reveal>
          <Reveal as="h2" className="display section__title" delay={0.05}>
            What happens between your question and the answer.
          </Reveal>
        </div>

        <div className="shell exam">
          {EXAM.map((item, index) => (
            <Reveal className="exam__row" key={item.step} delay={index * 0.08}>
              <span className="exam__step code">{item.step}</span>
              <h3 className="exam__title">{item.title}</h3>
              <p className="exam__body">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" id="impression">
        <div className="shell section__head">
          <Reveal as="p" className="eyebrow">Impression</Reveal>
          <Reveal as="h2" className="display section__title" delay={0.05}>
            What you actually get.
          </Reveal>
        </div>

        <div className="shell">
          {/* The rule-grid paints its own background, so it has to sit inside
              the shell's gutter rather than on it. */}
          <div className="cards">
            {IMPRESSION.map((card, index) => (
              <Reveal className="card" key={card.label} delay={index * 0.08}>
                <span className="card__label code">{card.label}</span>
                <h3 className="card__title">{card.title}</h3>
                <p className="card__body">{card.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section advice" id="advice">
        <div className="shell advice__grid">
          <Reveal>
            <p className="eyebrow eyebrow--veil">Advice</p>
            <h2 className="display advice__title">
              Where this stops being useful.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="prose advice__body">
              DermAI reads terminology. It cannot see you, cannot examine you,
              and cannot tell you what you have. Skin that is spreading fast,
              breaking open, bleeding, or coming with a fever needs a person,
              today. A mole that has changed shape, edge, or colour needs a
              dermatologist, not a chat window.
            </p>
            <p className="prose advice__body">
              Use it the way you would use a very well-read friend: to
              understand the words, prepare your questions, and know what to
              take seriously.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section cta">
        <div className="shell cta__inner">
          <Reveal as="h2" className="display cta__title">
            Ask the thing you have been searching at 2am.
          </Reveal>
          <Reveal delay={0.1}>
            <Magnetic>
              <Link to="/signup" className="btn cta__btn">
                Create an account
                <FiArrowRight className="btn__arrow" aria-hidden="true" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
