import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Reveal from "../components/Reveal";
import Magnetic from "../components/Magnetic";
import { CORPUS_SIZE } from "../data/concepts";
import "./Features.css";

/* Rather than a card grid, this page shows one question going through the
   system end to end. The retrieved rows below are the real SNOMED concepts a
   psoriasis query pulls back. */

const RETRIEVED = [
  { id: "200965009", term: "Plaque psoriasis", weight: 0.94 },
  { id: "200962007", term: "Psoriasis annularis", weight: 0.71 },
  { id: "135841008", term: "Dry eczema", weight: 0.58 },
  { id: "200766001", term: "Parakeratosis", weight: 0.41 },
  { id: "200775004", term: "Atopic neurodermatitis", weight: 0.33 },
];

const CAPABILITIES = [
  {
    title: "Reads the question you asked",
    body: "Two retrievers run at once. Keyword search catches the literal words; a SapBERT vector search — a language model trained on biomedical terminology — catches the concept behind them. Scores merge at 30/70 in favour of meaning.",
    meta: "BM25 + FAISS IVFPQ",
  },
  {
    title: "Answers only from what it retrieved",
    body: "The retrieved definitions are handed to the model as its working material. If the search comes back with nothing relevant, the answer says so and points you to a clinician rather than filling the gap.",
    meta: "Retrieval-augmented generation",
  },
  {
    title: "Keeps the thread",
    body: "Conversations are stored against your account, so a follow-up three days later still knows what you described the first time.",
    meta: "Per-account history",
  },
  {
    title: "Says what it is",
    body: "Every answer holds its own limits: this is a reading assistant, not a diagnosis, and some things need to be looked at in person.",
    meta: "Stated in every reply",
  },
];

export default function Features() {
  return (
    <>
      <section className="fhero">
        <div className="shell">
          <Reveal as="p" className="eyebrow">Method</Reveal>
          <Reveal as="h1" className="display fhero__title" delay={0.05}>
            One question, followed all the way through.
          </Reveal>
          <Reveal as="p" className="prose fhero__prose" delay={0.1}>
            Most assistants answer from whatever the model happens to remember.
            This one looks the terms up first. Here is what that looks like from
            the inside.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell trace">
          <Reveal className="trace__stage">
            <p className="eyebrow">The question</p>
            <p className="trace__question">
              “Silvery scaly patches on both elbows that come and go — what is
              that called?”
            </p>
          </Reveal>

          <Reveal className="trace__stage" delay={0.08}>
            <p className="eyebrow">What the search returned</p>
            <ul className="hits">
              {RETRIEVED.map((hit) => (
                <li className="hit" key={hit.id}>
                  <span className="hit__id code">{hit.id}</span>
                  <span className="hit__term">{hit.term}</span>
                  <span className="hit__bar" aria-hidden="true">
                    <span className="hit__fill" style={{ "--w": `${hit.weight * 100}%` }} />
                  </span>
                  <span className="hit__score code">{hit.weight.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="trace__note code">
              Merged score · 5 of {CORPUS_SIZE.toLocaleString()} concepts
            </p>
          </Reveal>

          <Reveal className="trace__stage" delay={0.16}>
            <p className="eyebrow">What you read back</p>
            <blockquote className="trace__answer">
              What you are describing matches <em>plaque psoriasis</em> closely:
              raised patches with a silvery scale, often on elbows and knees,
              flaring and settling over time. The scale forms because skin cells
              turn over faster than they shed — the term for that is{" "}
              <em>parakeratosis</em>. Eczema can look similar but usually itches
              more and scales less. A dermatologist can tell them apart on sight,
              and the treatments differ, so it is worth getting looked at rather
              than guessing.
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell section__head">
          <Reveal as="p" className="eyebrow">Capabilities</Reveal>
          <Reveal as="h2" className="display section__title" delay={0.05}>
            Four things it does, and does narrowly.
          </Reveal>
        </div>

        <div className="shell caps">
          {CAPABILITIES.map((item, index) => (
            <Reveal className="cap" key={item.title} delay={index * 0.06}>
              <span className="cap__meta code">{item.meta}</span>
              <h3 className="cap__title">{item.title}</h3>
              <p className="cap__body">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section cta">
        <div className="shell cta__inner">
          <Reveal as="h2" className="display cta__title">Try it on your own question.</Reveal>
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
