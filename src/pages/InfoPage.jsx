import React from 'react';
import { Link } from 'react-router-dom';

const InfoPage = () => {
  return (
    <div className="container py-16 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 className="text-4xl font-bold mb-4">Under Construction</h1>
      <p className="text-secondary max-w-lg mb-8 mx-auto">
        This legal or informational page (Terms, Privacy, Help Center) is currently being drafted by our legal team and will be published soon.
      </p>
      <Link to="/" className="btn btn-primary">Return Home</Link>
    </div>
  );
};

export default InfoPage;
