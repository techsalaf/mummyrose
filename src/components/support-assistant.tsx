import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import assistantMark from "@/assets/assistant-mark.png";

const SUGGESTIONS = [
  "Which spice blend should I start with?",
  "Do you deliver outside Lagos?",
  "How do I order wholesale?",
];

export function SupportAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: () => toast.error("Rose couldn't reply just now. Please try again."),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open && status === "ready") textareaRef.current?.focus();
  }, [open, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage({ text: value });
  };

  return (
    <>
      {open && (
        <div className="fixed inset-x-3 bottom-3 z-[60] flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[560px] sm:w-[400px]">
          <div className="flex items-center gap-3 border-b border-border bg-secondary/60 px-4 py-3">
            <img
              src={assistantMark}
              alt=""
              width={512}
              height={512}
              loading="lazy"
              className="size-9 rounded-full bg-background object-contain p-1"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg leading-none">Ask Rose</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Pantry help, orders &amp; trade enquiries
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close support assistant"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>

          <Conversation className="flex-1">
            <ConversationContent className="gap-5 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Hello 👋 I'm Rose. Ask me about our spices, flours and infusions, delivery,
                    or wholesale and export supply.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) =>
                        part.type === "text" ? (
                          <MessageResponse key={i}>{part.text}</MessageResponse>
                        ) : null,
                      )}
                    </MessageContent>
                  </Message>
                ))
              )}
              {status === "submitted" && <Shimmer className="text-sm">Thinking...</Shimmer>}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <PromptInput
              onSubmit={(_, event) => {
                event.preventDefault();
                send(input);
              }}
            >
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a product, order or wholesale…"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open support assistant"
          className="fixed right-4 bottom-4 z-[60] flex items-center gap-2 rounded-full bg-ink py-3 pr-5 pl-3 text-ink-foreground shadow-xl transition-transform hover:scale-[1.03] sm:right-6 sm:bottom-6"
        >
          <img
            src={assistantMark}
            alt=""
            width={512}
            height={512}
            loading="lazy"
            className="size-8 rounded-full bg-background object-contain p-0.5"
          />
          <span className="text-sm font-medium">Ask Rose</span>
          <MessageCircle className="size-4 opacity-70" />
        </button>
      )}
    </>
  );
}
