function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text: string) {
  let out = escapeHtml(text);
  // bold **text**
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // markdown links [text](url)
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // bare urls
  out = out.replace(/(?<!href="|">)(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  return out;
}

/**
 * Converts simple organizer-authored plain text (with blank-line paragraphs,
 * "# " headings, "- " bullet lists, **bold**, and links) into safe structured
 * HTML for the event description section.
 */
export function formatDescription(raw: string | null | undefined): string {
  if (!raw || !raw.trim()) return "";

  const blocks = raw.trim().split(/\n\s*\n/);
  const html = blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return "";

      if (lines.every((l) => l.startsWith("- "))) {
        const items = lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }

      if (lines[0].startsWith("### ")) {
        return `<h3>${inline(lines[0].slice(4))}</h3>`;
      }
      if (lines[0].startsWith("## ") || lines[0].startsWith("# ")) {
        const stripped = lines[0].replace(/^#+\s*/, "");
        return `<h3>${inline(stripped)}</h3>`;
      }

      return `<p>${lines.map(inline).join("<br/>")}</p>`;
    })
    .join("");

  return html;
}
