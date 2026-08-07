import { useState } from "react";
import { Check, Facebook, Link2, Printer, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * Social sharing + print. Uses the native share sheet on mobile where
 * available and falls back to copy-to-clipboard everywhere else.
 */
export function ShareButtons({
  title,
  url,
  showPrint = false,
}: {
  title: string;
  url: string;
  showPrint?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        /* dismissed — fall through to copy */
      }
    }
    void copy();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs tracking-wide text-muted-foreground uppercase">Share</span>
      <Button variant="outline" size="icon-sm" onClick={nativeShare} aria-label="Share this page">
        <Share2 className="size-4" />
      </Button>
      <Button variant="outline" size="icon-sm" asChild>
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Share on WhatsApp"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
            <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.16L2 22l4.98-1.6A9.9 9.9 0 1 0 12.04 2Zm5.8 14.06c-.25.7-1.45 1.35-2 1.4-.55.05-1.02.2-3.5-.9s-3.86-3.7-4-3.9c-.14-.2-.9-1.3-.9-2.5s.63-1.77.86-2c.22-.25.48-.3.65-.3h.47c.15 0 .35-.03.54.42.2.47.68 1.68.74 1.8.06.12.1.26.02.42-.09.16-.35.5-.5.66-.15.16-.24.24-.1.5.15.24.65 1.04 1.39 1.7.95.85 1.4 1 1.65 1.12.24.11.38.1.53-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.22.08 1.38.65 1.62.77.24.12.4.18.46.28.06.1.06.6-.19 1.3Z" />
          </svg>
        </a>
      </Button>
      <Button variant="outline" size="icon-sm" asChild>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Share on Facebook"
        >
          <Facebook className="size-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon-sm" asChild>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Share on X"
        >
          <Twitter className="size-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon-sm" onClick={copy} aria-label="Copy link">
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </Button>
      {showPrint && (
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
          <Printer className="size-4" /> Print
        </Button>
      )}
    </div>
  );
}
