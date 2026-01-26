// client/src/components/common/SEO.jsx
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteTitle = 'HomeScape';
  const defaultDescription = 'Find your dream home with AI-powered recommendations. Browse thousands of properties for sale and rent.';
  const defaultImage = '/og-image.jpg';
  const siteUrl = 'https://homescape.com';

  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const fullDescription = description || defaultDescription;
  const fullImage = image || defaultImage;
  const fullUrl = url || siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEO;