import { useRef, type ReactNode } from "react";
import { Bold, Heading2, Italic, Link2, List, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Lightweight markdown-flavoured rich text editing + rendering.
 * Keeps CMS content portable (plain text in the database) while giving staff
 * a toolbar for headings, emphasis, lists, quotes and links.
 */

type Wrap = { before: string; after?: string; block?: boolean };

const TOOLS: { icon: typeof Bold; label: string; wrap: Wrap }[] = [
  { icon: Heading2, label: "Heading", wrap: { before: "## ", block: true } },
  { icon: Bold, label: "Bold", wrap: { before: "**", after: "**" } },
  { icon: Italic, label: "Italic", wrap: { before: "_", after: "_" } },
  { icon: List, label: "Bullet list", wrap: { before: "- ", block: true } },
  { icon: Quote, label: "Quote", wrap: { before: "> ", block: true } },
  { icon: Link2, label: "Link", wrap: { before: "[", after: "](https://)" } },
];

export function RichTextEditor({
  value,
  onChange,
  rows = 12,
  placeholder,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
  id?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (wrap: Wrap) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? start;
    const selected = value.slice(start, end);
    const insert = wrap.block
      ? `${start > 0 && value[start - 1] !== "\n" ? "\n" : ""}${wrap.before}${selected || "Text"}`
      : `${wrap.before}${selected || "text"}${wrap.after ?? ""}`;
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + insert.length;
      el.setSelectionRange(caret, caret);
    });
  };

  return (
    <div className="rounded-md border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b px-1.5 py-1.5">
        {TOOLS.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            size="icon"
            variant="ghost"
            className="size-8"
            aria-label={tool.label}
            title={tool.label}
            onClick={() => apply(tool.wrap)}
          >
            <tool.icon className="size-4" />
          </Button>
        ))}
        <span className="ml-auto pr-2 text-[11px] text-muted-foreground">Markdown supported</span>
      </div>
      <Textarea
        id={id}
        ref={ref}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-none border-0 focus-visible:ring-0"
      />
    </div>
  );
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("_")) nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    else {
      const parts = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      nodes.push(
        <a key={key++} href={parts?.[2]} className="text-accent underline underline-offset-4">
          {parts?.[1]}
        </a>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Renders markdown-lite content produced by RichTextEditor. */
export function RichText({ content, className }: { content: string | null | undefined; className?: string }) {
  if (!content?.trim()) return null;
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const lines = block.split("\n").filter(Boolean);
        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="my-3 list-disc space-y-1 pl-5">
              {lines.map((line, i) => (
                <li key={i}>{inline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith("> ")) {
          return (
            <blockquote key={index} className="my-4 border-l-2 border-accent pl-4 italic">
              {inline(block.replace(/^> /gm, ""))}
            </blockquote>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={index} className="mt-6 font-display text-lg">
              {inline(block.slice(4))}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="mt-8 font-display text-xl">
              {inline(block.slice(3))}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2 key={index} className="mt-8 font-display text-2xl">
              {inline(block.slice(2))}
            </h2>
          );
        }
        return (
          <p key={index} className="my-3 leading-relaxed">
            {inline(block)}
          </p>
        );
      })}
    </div>
  );
}
