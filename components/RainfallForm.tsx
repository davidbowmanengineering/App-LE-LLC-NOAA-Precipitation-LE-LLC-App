import React from 'react';

type InputMode = 'coords' | 'address';

interface RainfallFormProps {
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    const baseClasses = "flex-1 py-2 text-sm font-medium text-center rounded-t-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors";
    const activeClasses = "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400";
    const inactiveClasses = "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600";
    return (
        <button type="button" onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    )
}

export const RainfallForm: React.FC<RainfallFormProps> = ({
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  address,
  setAddress,
  inputMode,
  setInputMode,
  onSubmit,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-t-md p-1 space-x-1">
            <TabButton active={inputMode === 'coords'} onClick={() => setInputMode('coords')}>Coordinates</TabButton>
            <TabButton active={inputMode === 'address'} onClick={() => setInputMode('address')}>Address</TabButton>
        </div>

      <div className="flex-grow space-y-4 p-4 bg-white dark:bg-slate-800 border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-md">
        {inputMode === 'coords' ? (
          <>
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g., 32.2226"
                step="any"
                required
                aria-label="Latitude"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g., -110.9747"
                step="any"
                required
                aria-label="Longitude"
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              U.S. Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500"
              placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View, CA"
              required
              aria-label="U.S. Address"
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Fetching Data...' : 'Fetch Rainfall Data'}
      </button>
    </form>
  );
};