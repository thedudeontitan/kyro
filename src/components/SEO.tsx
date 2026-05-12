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
  title = "Kyro - Virtual Credit Card | Spend Without Selling Your Crypto",
  description = "Get an instant virtual credit card backed by USDC. Spend anywhere without selling your crypto. Earn yield on collateral. Powered by Solana.",
  keywords = "virtual credit card, USDC credit card, crypto credit card, spend without selling, virtual card crypto, stablecoin credit, collateral backed credit, yield earning card, solana credit card, non-custodial credit",
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
            "category": "Virtual Credit Card"
          },
          "featureList": [
            "Instant virtual credit card",
            "USDC-backed credit lines",
            "Yield-earning collateral",
            "Pay anywhere",
            "Non-custodial & on-chain"
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
