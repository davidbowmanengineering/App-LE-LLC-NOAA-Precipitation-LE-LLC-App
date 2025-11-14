
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.512 5.73 6.512 5.73s0 0 .001-.001a4.5 4.5 0 015.972.955 4.5 4.5 0 01.956 5.972l-2.706 1.912a6.012 6.012 0 01-2.706-1.912 6.012 6.012 0 01-1.912-2.706zM10 6a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
             </svg>
            <span className="ml-3 text-xl font-semibold text-slate-800 dark:text-white">Hydro Data Fetcher</span>
          </div>
        </div>
      </div>
    </header>
  );
};
