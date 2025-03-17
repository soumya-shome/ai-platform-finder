import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SEO from '@/components/SEO';

const Sitemap = () => {
  const sitePages = [
    { path: '/', name: 'Home', description: 'Main landing page with featured AI platforms' },
    { path: '/directory', name: 'Directory', description: 'Browse all AI platforms in our database' },
    { path: '/compare', name: 'Compare Platforms', description: 'Compare AI platforms side by side' },
    { path: '/submit', name: 'Submit Platform', description: 'Submit a new AI platform to our directory' },
    { path: '/about', name: 'About', description: 'Learn about AI Platform Finder and our mission' },
    { path: '/privacy', name: 'Privacy Policy', description: 'Our privacy policy and data practices' },
    { path: '/terms', name: 'Terms & Conditions', description: 'Terms and conditions for using our service' },
    { path: '/sitemap', name: 'Sitemap', description: 'Navigation overview of all pages on our website' },
  ];

  return (
    <Layout>
      <SEO
        title="Sitemap"
        description="Browse all pages available on AI Platform Finder. Find the resources you need with our complete website sitemap."
        keywords="AI platform sitemap, website navigation, AI tools directory, site structure"
      />
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": "https://yourwebsite.com",
          "name": "AI Platform Finder",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://yourwebsite.com/directory?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      <div className="container py-12 max-w-4xl mx-auto animate-fade-in">
        {/* Breadcrumb Navigation for better SEO & UX */}
        <nav className="text-sm mb-4">
          <Link to="/" className="text-primary hover:underline">Home</Link> &gt; Sitemap
        </nav>

        <h1 className="text-4xl font-bold mb-2">Sitemap</h1>
        <p className="text-muted-foreground mb-6">A complete map of all pages on our website</p>
        <Separator className="mb-8" />

        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Main Pages</h2>
              <ul className="space-y-4">
                {sitePages.map((page) => (
                  <li key={page.path} className="border-b pb-3 last:border-0">
                    <Link to={page.path} className="text-primary hover:underline font-medium">
                      {page.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Dynamic Pages</h2>
              <p className="text-muted-foreground">
                Our platform also includes dynamically generated pages for each AI platform in our directory.
                These pages are created in the format: <code>/platform/:id</code>
              </p>
              <div className="mt-4">
                <Link to="/directory" className="text-primary hover:underline">
                  Browse all platforms in our directory →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Sitemap;
