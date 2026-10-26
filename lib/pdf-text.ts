/**
 * The PDF uses the built-in Helvetica font (WinAnsi encoding), which has no glyphs for arrows,
 * emoji and a few other symbols. `pdfSafe` maps them to close equivalents so nothing renders as a box.
 */

const REPLACEMENTS: [RegExp, string][] = [
  [/[→⟶➜➔]/g, "->"],
  [/[←⟵]/g, "<-"],
  [/[≥]/g, ">="],
  [/[≤]/g, "<="],
  [/[✓✔]/g, "+"],
  [/ /g, " "],
];

/** Characters outside Latin-1 and the WinAnsi extras (– — ‘ ’ “ ” • … € ™). */
const UNSUPPORTED = /[^\u0000-ÿ–—‘’“”•…€™]/gu;

export function pdfSafe(text: string): string {
  let out = text;
  for (const [pattern, replacement] of REPLACEMENTS) out = out.replace(pattern, replacement);
  return out.replace(UNSUPPORTED, "").replace(/ {2,}/g, " ").trim();
}
