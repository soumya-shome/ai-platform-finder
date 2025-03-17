
import React from 'react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';

const Terms = () => {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
        <Separator className="mb-8" />
        <p className="text-sm text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            Welcome to AI Platform Finder. By accessing or using our website, you agree to be bound by these Terms and Conditions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
          <p>
            By accessing or using AI Platform Finder, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
            If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for
            safeguarding the password that you use to access our service and for any activities or actions under your password.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">User Content</h2>
          <p>
            Our service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, or other material.
            You are responsible for the content that you post, including its legality, reliability, and appropriateness.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of AI Platform Finder.
            The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
          <p>
            In no event shall AI Platform Finder be liable for any indirect, incidental, special, consequential, or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of
            or inability to access or use the service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service
            after those revisions become effective, you agree to be bound by the revised terms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@aiplatformfinder.com" className="text-primary hover:underline">legal@aiplatformfinder.com</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
