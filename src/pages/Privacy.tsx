
import React from 'react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';

const Privacy = () => {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <Separator className="mb-8" />
        <p className="text-sm text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            At AI Platform Finder, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="space-y-2 list-disc pl-6 mb-6">
            <li>
              <strong>Account Information:</strong> When you create an account, we collect your email address and password.
            </li>
            <li>
              <strong>Profile Information:</strong> You may choose to provide additional information such as your name, job title, or organization.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about how you use our website, including pages visited and features used.
            </li>
            <li>
              <strong>Cookies and Similar Technologies:</strong> We use cookies to enhance your experience and collect information about your browsing activities.
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="space-y-2 list-disc pl-6 mb-6">
            <li>To provide and maintain our services</li>
            <li>To authenticate users and prevent fraud</li>
            <li>To improve our website and user experience</li>
            <li>To communicate with you about updates or changes to our services</li>
            <li>To respond to your requests or inquiries</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
          <p>
            Our website may include links to third-party websites or services. We are not responsible for the privacy practices of these third parties,
            and we encourage you to review their privacy policies.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@aiplatformfinder.com" className="text-primary hover:underline">privacy@aiplatformfinder.com</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
