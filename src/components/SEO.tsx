import { Helmet } from "react-helmet-async";

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonical?: string;
};

export const SEO = ({
  title = "Kyro - Crypto Credit Card | Spend Crypto Without Selling | USDC Credit Line",
  description = "Get instant crypto credit without selling your assets. Kyro offers crypto-backed credit cards, USDC credit lines, and yield-earning collateral. Spend crypto in real life with tap-to-pay.",
  keywords = "crypto credit card, crypto backed credit card, USDC credit card, spend crypto without selling, crypto credit line, stablecoin credit card, crypto collateral credit, yield backed credit, crypto tap to pay",
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  canonical,
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Kyro" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:site" content="@kyro" />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Kyro" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Kyro",
          "description": description,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "category": "Crypto Credit Card"
          },
          "featureList": [
            "Crypto-backed credit cards",
            "USDC credit lines",
            "Yield-earning collateral",
            "Tap-to-pay technology",
            "Non-custodial crypto spending"
          ],
          "sameAs": [
            "https://x.com/kyro",
            "https://www.instagram.com/kyro/"
          ],
          "publisher": {
            "@type": "Organization",
            "name": "Kyro",
            "sameAs": [
              "https://x.com/kyro",
              "https://www.instagram.com/kyro/"
            ]
          }
        })}
      </script>
    </Helmet>
  );
};
