
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-5">
        <h1 className="text-3xl font-bold">Final Year Project Tracker</h1>
        <p className="text-md text-slate-300">Savitribai Phule Pune University - Department of Computer Engineering</p>
      </div>
    </header>
  );
};

export default Header;