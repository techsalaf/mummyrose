import teaImage from "@/assets/lifestyle-tea.jpg";
import { NewsletterForm } from "@/components/newsletter-form";
import { Reveal } from "@/components/reveal";

/** Closing invitation — cocoa band with an overlapping linen still life. */
export function NewsletterCta({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="container-wide grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-0">
        <Reveal className="lg:col-span-7 lg:pr-20">
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-gold" />
            The pantry letter
          </p>
          <h2 className="display-xl mt-6 max-w-[18ch] text-balance">{heading}</h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-foreground/70">{body}</p>
          <div className="mt-10">
            <NewsletterForm tone="dark" />
          </div>
          <p className="mt-4 text-[10px] tracking-[0.2em] text-ink-foreground/45 uppercase">
            One letter a month · Unsubscribe anytime
          </p>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-5 lg:-ml-10">
          <div className="grain overflow-hidden rounded-sm shadow-editorial">
            <img
              src={teaImage}
              alt="Amber Nigerian herbal infusion beside dried hibiscus on warm linen"
              loading="lazy"
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
