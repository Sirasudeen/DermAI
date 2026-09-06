/*
 * A deliberately small formatter. Answers here are medical prose, not code, so
 * the old syntax highlighter had nothing to do; what these replies actually
 * contain is emphasis, the occasional list, and clinical terms worth setting
 * apart. That is all this handles.
 */

const INLINE = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;

export function inlineParts(text) {
  return text.split(INLINE).filter(Boolean).map((chunk) => {
    if (/^(\*\*|__).+(\*\*|__)$/.test(chunk)) {
      return { kind: "strong", text: chunk.slice(2, -2) };
    }
    if (/^(\*|_).+(\*|_)$/.test(chunk)) {
      return { kind: "em", text: chunk.slice(1, -1) };
    }
    if (/^`.+`$/.test(chunk)) {
      return { kind: "term", text: chunk.slice(1, -1) };
    }
    return { kind: "text", text: chunk };
  });
}

export function blocks(message) {
  const lines = String(message ?? "").replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let list = null;

  const closeList = () => {
    if (list) {
      out.push(list);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) {
      closeList();
      continue;
    }

    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);

    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      const item = bullet ? bullet[1] : numbered[2];
      if (!list || list.ordered !== ordered) {
        closeList();
        list = { kind: "list", ordered, items: [] };
      }
      list.items.push(item);
      continue;
    }

    closeList();

    const heading = line.match(/^#{1,4}\s+(.*)$/);
    if (heading) {
      out.push({ kind: "heading", text: heading[1] });
      continue;
    }

    out.push({ kind: "para", text: line });
  }

  closeList();
  return out;
}
