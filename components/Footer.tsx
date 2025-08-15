
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-12 no-print">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Keystone School of Engineering. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
