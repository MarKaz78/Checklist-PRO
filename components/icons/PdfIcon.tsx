import React from 'react';

const PdfIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 15v-2a2 2 0 012-2h2a2 2 0 012 2v2" />
    <path d="M11 12h2" />
    <path d="M16 18h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2v6z" />
  </svg>
);

export default PdfIcon;
