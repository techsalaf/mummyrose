export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from trusted app data only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mummy Rose",
  url: "https://mummyrose.com",
  description:
    "Natural Nigerian spices, stone-milled flours, herbal infusions and food products for retail, wholesale and export.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@mummyrose.com",
    contactType: "sales",
  },
  sameAs: ["https://instagram.com/mummyrose"],
};
