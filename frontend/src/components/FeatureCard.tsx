import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  accent?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, accent }) => {
  return (
    <div className={`feature-card ${accent ? 'accent-card' : ''}`}>
      <div className="fc-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;