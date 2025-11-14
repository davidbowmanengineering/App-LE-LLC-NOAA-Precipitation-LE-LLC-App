import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RainfallForm } from './components/RainfallForm';
import { RainfallTable } from './components/RainfallTable';
import { Spinner } from './components/Spinner';
import { fetchRainfallData, geocodeAddress } from './services/geminiService';
import type { RainfallData } from './types';
import { InfoCard } from './components/InfoCard';
import { MapComponent } from './components/MapComponent';

type InputMode = 'coords' | 'address';

const App: React.FC = () => {
  const [latitude, setLatitude] = useState<string>('32.2226');
  const [longitude, setLongitude] = useState<string>('-110.9747');
  const [address, setAddress] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('coords');
  const [rainfallData, setRainfallData] = useState<RainfallData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFetchData = useCallback(async () => {
    setError(null);
    setRainfallData(null);
    setIsLoading(true);

    try {
      let lat: number;
      let lon: number;

      if (inputMode === 'address') {
        if (!address.trim()) {
          throw new Error('Please enter a U.S. address.');
        }
        const coords = await geocodeAddress(address);
        lat = coords.latitude;
        lon = coords.longitude;
        setLatitude(lat.toFixed(6));
        setLongitude(lon.toFixed(6));
      } else {
        lat = parseFloat(latitude);
        lon = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          throw new Error('Invalid coordinates. Please enter a valid latitude (-90 to 90) and longitude (-180 to 180).');
        }
      }

      const data = await fetchRainfallData(lat, lon);
      setRainfallData(data);
    } catch (err: any) {
      if (err.message.includes('geocoding')) {
        setError('Failed to find coordinates for the address. Please check the address and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again later.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, address, inputMode]);
  
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setInputMode('coords'); // Switch back to coords mode when map is clicked
  }, []);

  const latNum = parseFloat(latitude) || 0;
  const lonNum = parseFloat(longitude) || 0;

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-2">
            Rainfall Data Retriever
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Enter coordinates or an address to fetch simulated NOAA Atlas 14 estimates.
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
             <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-2">
                    <RainfallForm
                      latitude={latitude}
                      setLatitude={setLatitude}
                      longitude={longitude}
                      setLongitude={setLongitude}
                      address={address}
                      setAddress={setAddress}
                      inputMode={inputMode}
                      setInputMode={setInputMode}
                      onSubmit={handleFetchData}
                      isLoading={isLoading}
                    />
                </div>
                <div className="md:col-span-3 h-64 md:h-auto">
                    <MapComponent
                        latitude={latNum}
                        longitude={lonNum}
                        onMapInteraction={handleMapClick}
                        rainfallData={rainfallData}
                    />
                     <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Click on the map or drag the marker to set coordinates.
                     </p>
                </div>
            </div>
          </div>

          {isLoading && <Spinner />}
          
          {error && (
             <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {rainfallData ? (
            <RainfallTable data={rainfallData} latitude={latitude} longitude={longitude} />
          ) : (
             !isLoading && !error && <InfoCard />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;