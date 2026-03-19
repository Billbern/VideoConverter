import React from 'react';
import { Link } from 'react-router-dom';

const CTABanner: React.FC = () => {
  return (
    <div className="cta-banner">
      <div>
        <h3>Ready to convert?</h3>
        <p>Start converting your media files for free today.</p>
      </div>
      <Link to="/" className="btn-cta">
        Get Started
      </Link>
    </div>
  );
};

export default CTABanner;