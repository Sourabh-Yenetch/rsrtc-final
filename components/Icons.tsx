import React from 'react';

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM11 5a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V5Z"></path>
    <path d="M7 11a1 1 0 0 1 1-1h.5a1 1 0 0 1 1 1v.5a5.5 5.5 0 0 0 5 5V17a1 1 0 0 1 1 1h.5a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1H7a1 1 0 0 1-1-1v-.5a5.5 5.5 0 0 0 5-5v-.5a1 1 0 0 1-1-1H8a1 1 0 0 1-1-1Z"></path>
  </svg>
);

export const BusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H7C7.55228 20 8 19.5523 8 19V18H16V19C16 19.5523 16.4477 20 17 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4ZM6 8H18V14H6V8ZM8 9C7.44772 9 7 9.44772 7 10V12C7 12.5523 7.44772 13 8 13C8.55228 13 9 12.5523 9 12V10C9 9.44772 8.55228 9 8 9ZM16 9C15.4477 9 15 9.44772 15 10V12C15 12.5523 15.4477 13 16 13C16.5523 13 17 12.5523 17 12V10C17 9.44772 16.5523 9 16 9Z"></path>
    </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

// FIX: Add missing SwapIcon component.
export const SwapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M13.5 4.438v2.812a.75.75 0 01-1.5 0V4.438l-2.72 2.72a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L13.5 4.438zM6.5 15.562v-2.812a.75.75 0 011.5 0v2.812l2.72-2.72a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L1.72 12.62a.75.75 0 011.06-1.06l2.72 2.72z" clipRule="evenodd" />
    </svg>
);