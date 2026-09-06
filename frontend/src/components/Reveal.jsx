import { motion } from "framer-motion";
import { EASE } from "../lib/motion";

/* Scroll reveal used for every section body. One shared curve keeps the whole
   page moving in the same handwriting. */
export default function Reveal({ children, delay = 0, y = 28, className, as = "div" }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
