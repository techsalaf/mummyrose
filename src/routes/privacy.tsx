import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Mummy Rose" },
      { name: "description", content: "How Mummy Rose collects, uses and protects your personal information when you shop or contact us." },
      { property: "og:title", content: "Privacy Policy — Mummy Rose" },
      { property: "og:description", content: "How Mummy Rose collects, uses and protects your personal information when you shop or contact us." },
    ],
  }),
  component: LegalPage,
});

const sections = [{ title: "What we collect", body: "Your name, email, phone number and delivery address when you place an order or send an enquiry, plus basic analytics about how the site is used." }, { title: "How we use it", body: "To fulfil and deliver orders, respond to enquiries, and send newsletters if you have opted in. We never sell your data." }, { title: "Payments", body: "Card and transfer payments are processed by our payment partners. We do not store card details on our systems." }, { title: "Your choices", body: "You can unsubscribe from emails at any time, and you can ask us to correct or delete your data by emailing hello@mummyrose.com." }, { title: "Cookies", body: "We use essential cookies to keep your cart and session working, and privacy-respecting analytics to improve the store." }];

function LegalPage() {
  return (
    <div className="container-page max-w-3xl py-12 md:py-16">
      <p className="eyebrow text-accent">Legal</p>
      <h1 className="mt-3 font-display text-4xl">Privacy policy</h1>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl">{section.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
