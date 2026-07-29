import { InquiryForm } from "@/components/inquiry-form";
import type { InquiryInput } from "@/lib/schemas";

export type BusinessPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  points: { title: string; body: string }[];
  inquiryType: InquiryInput["type"];
  requirementsLabel?: string;
  formTitle?: string;
};

export function BusinessPage({
  eyebrow,
  title,
  intro,
  points,
  inquiryType,
  requirementsLabel,
  formTitle = "Start the conversation",
}: BusinessPageProps) {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-20 md:py-28">
          <p className="eyebrow text-primary-foreground/60">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80">{intro}</p>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="grid gap-8">
              {points.map((point, i) => (
                <div key={point.title} className="border-l-2 border-accent/40 pl-5">
                  <p className="eyebrow text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 font-display text-xl">{point.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl">{formTitle}</h2>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
              Tell us what you need. A member of our commercial team responds within one business day.
            </p>
            <InquiryForm type={inquiryType} requirementsLabel={requirementsLabel} />
          </div>
        </div>
      </section>
    </>
  );
}
