
import React from 'react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">About AI Platform Finder</h1>
        <Separator className="mb-8" />
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            Welcome to AI Platform Finder, your go-to resource for discovering, comparing, and evaluating AI platforms and tools.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to help individuals, businesses, and developers navigate the rapidly evolving landscape of AI tools and platforms.
            We provide comprehensive, unbiased information about AI platforms to help you make informed decisions about which tools best suit your needs.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
          <ul className="space-y-2 list-disc pl-6 mb-6">
            <li>Comprehensive directory of AI platforms and tools</li>
            <li>Detailed information about features, pricing, and use cases</li>
            <li>User reviews and ratings</li>
            <li>Side-by-side platform comparisons</li>
            <li>Regular updates as the AI landscape evolves</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Commitment</h2>
          <p>
            We are committed to providing accurate, up-to-date information about AI platforms. Our platform is constantly evolving,
            and we rely on contributions from users like you to help keep our directory comprehensive and current.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            Have questions, suggestions, or feedback? We'd love to hear from you. Contact us at <a href="mailto:info@aiplatformfinder.com" className="text-primary hover:underline">info@aiplatformfinder.com</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
