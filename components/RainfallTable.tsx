
import React, { useState } from 'react';
import type { RainfallData, RainfallRecord } from '../types';

interface RainfallTableProps {
  data: RainfallData;
  latitude: string;
  longitude: string;
}

type ActiveTable = 'intensity' | 'depth';

const tableHeaders: { key: keyof RainfallRecord, label: string }[] = [
    { key: 'duration', label: 'Duration' },
    { key: '2-yr', label: '2-yr' },
    { key: '5-yr', label: '5-yr' },
    { key: '10-yr', label: '10-yr' },
    { key: '25-yr', label: '25-yr' },
    { key: '50-yr', label: '50-yr' },
    { key: '100-yr', label: '100-yr' },
];

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors";
    const activeClasses = "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300";
    const inactiveClasses = "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700";
    return (
        <button type="button" onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    )
}

export const RainfallTable: React.FC<RainfallTableProps> = ({ data, latitude, longitude }) => {
  const [activeTab, setActiveTab] = useState<ActiveTable>('intensity');

  const activeData = activeTab === 'intensity' ? data.intensityData : data.depthData;
  const unit = activeTab === 'intensity' ? 'inches/hour' : 'inches';
  const title = activeTab === 'intensity' ? 'Intensity' : 'Depth';

  const handleDownloadCSV = () => {
    if (!activeData) return;
    const headers = tableHeaders.map(h => h.label).join(',');
    const rows = activeData.map(row => 
      tableHeaders.map(header => row[header.key]).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `rainfall_${activeTab}_${latitude}_${longitude}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Precipitation Frequency Estimates</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Showing Rainfall {title} ({unit}) for Lat: {latitude}, Lon: {longitude}
                </p>
            </div>
             <button
                onClick={handleDownloadCSV}
                className="mt-4 sm:mt-0 flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.086V3a1 1 0 112 0v8.086l1.293-1.379a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download CSV
            </button>
        </div>

      <div className="border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex space-x-2">
            <TabButton active={activeTab === 'intensity'} onClick={() => setActiveTab('intensity')}>Intensity</TabButton>
            <TabButton active={activeTab === 'depth'} onClick={() => setActiveTab('depth')}>Depth</TabButton>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              {tableHeaders.map((header) => (
                 <th key={header.key} className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {activeData && activeData.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                {tableHeaders.map(header => (
                    <td key={`${header.key}-${index}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-200">
                        {row[header.key]}
                    </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
