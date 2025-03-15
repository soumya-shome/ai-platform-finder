
import React from 'react';
import Layout from '@/components/Layout';
import PlatformSubmissionForm from '@/components/PlatformSubmissionForm';

const SubmitPlatform = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit a New AI Platform</h1>
          <p className="text-muted-foreground">
            Help us grow our directory by submitting a new AI platform. All submissions will be reviewed before publishing.
          </p>
        </div>
        
        <PlatformSubmissionForm />
      </div>
    </Layout>
  );
};

export default SubmitPlatform;
