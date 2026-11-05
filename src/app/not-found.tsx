import React from 'react';
import Link from 'next/link';
import { Home, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-sm border-0 p-5 text-center" style={{ maxWidth: 460 }}>
        <div className="text-muted mb-3">
          <FileQuestion size={56} className="text-secondary opacity-50 mx-auto" />
        </div>
        <h2 className="fw-bold text-dark mb-2">404 - Page Not Found</h2>
        <p className="text-muted small mb-4">
          The requested route or resource could not be found. Please check the URL or navigate back.
        </p>
        <div className="d-flex justify-content-center">
          <Link href="/" className="btn btn-primary d-inline-flex align-items-center gap-2">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
