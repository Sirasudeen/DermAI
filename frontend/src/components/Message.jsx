import { motion } from "framer-motion";
import { blocks, inlineParts } from "../lib/format";
import { EASE } from "../lib/motion";
import "./Message.css";

function Inline({ text }) {
  return inlineParts(text).map((part, index) => {
    if (part.kind === "strong") return <strong key={index}>{part.text}</strong>;
    if (part.kind === "em") return <em key={index}>{part.text}</em>;
    if (part.kind === "term") return <span className="msg__term" key={index}>{part.text}</span>;
    return <span key={index}>{part.text}</span>;
  });
}

function Body({ content }) {
  return blocks(content).map((block, index) => {
    if (block.kind === "heading") {
      return <h3 className="msg__heading" key={index}><Inline text={block.text} /></h3>;
    }
    if (block.kind === "list") {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`msg__list${block.ordered ? " msg__list--ordered" : ""}`} key={index}>
          {block.items.map((item, i) => (
            <li key={i}><Inline text={item} /></li>
          ))}
        </Tag>
      );
    }
    return <p className="msg__para" key={index}><Inline text={block.text} /></p>;
  });
}

export default function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <motion.article
      className={`msg msg--${isUser ? "user" : "assistant"}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <p className="msg__role code">{isUser ? "You" : "DermAI"}</p>
      <div className="msg__body">
        <Body content={content} />
      </div>
    </motion.article>
  );
}
