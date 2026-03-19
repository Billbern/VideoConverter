import React from 'react';

interface ToastProps {
  title: string;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, message, onClose }) => {
  return (
    <div className="toast show">
      <strong>{title}</strong>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
};

export default Toast;