import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="logo" style={{ fontSize: '1.2rem' }}>
        <div className="logo-icon" style={{ width: '28px', height: '28px' }}>☀️</div>
        Fluxr
      </div>
      <p>© 2026 Fluxr · human‑first media tools</p>
      <div className="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/blog">Blog</a>
        <a href="/support">Support</a>
        <a href="/pro">✨ Pro</a>
      </div>
    </footer>
  );
};

export default Footer;