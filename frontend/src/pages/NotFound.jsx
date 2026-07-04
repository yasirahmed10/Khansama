import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-dark text-center flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-display text-gold text-7xl font-black">404</h1>
      <h2 className="text-xl font-bold text-white uppercase tracking-wider">Page Not Found</h2>
      <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="btn-primary mt-4 text-xs uppercase tracking-wider">Back to Homepage</Link>
    </div>
  );
};

export default NotFound;
