
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Hydro Data Fetcher. All data is simulated for demonstration purposes.
        </p>
      </div>
    </footer>
  );
};
