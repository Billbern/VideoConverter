import React from 'react';

interface FormatCardProps {
  title: string;
  description: string;
  icon: string;
  count: string;
  type: 'video' | 'audio';
}

const FormatCard: React.FC<FormatCardProps> = ({ title, description, icon, count, type }) => {
  return (
    <div className="format-card">
      <div className={`fc-icon ${type}`}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="fc-count">{count}</div>
    </div>
  );
};

export default FormatCard;