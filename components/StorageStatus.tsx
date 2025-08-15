import React, { useState, useEffect } from 'react';

const StorageStatus: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<{
    persistent: boolean;
    quota: number;
    usage: number;
  } | null>(null);

  useEffect(() => {
    async function checkStorage() {
      if ('storage' in navigator) {
        try {
          const persistent = await navigator.storage.persisted();
          const estimate = await navigator.storage.estimate();
          
          setStorageInfo({
            persistent,
            quota: estimate.quota || 0,
            usage: estimate.usage || 0,
          });
        } catch (error) {
          console.warn('Storage check failed:', error);
        }
      }
    }
    
    checkStorage();
  }, []);

  if (!storageInfo) return null;

  const usagePercentage = storageInfo.quota > 0 
    ? (storageInfo.usage / storageInfo.quota * 100).toFixed(1)
    : '0';

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">Storage Status:</span>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${storageInfo.persistent ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className={storageInfo.persistent ? 'text-green-700' : 'text-yellow-700'}>
            {storageInfo.persistent ? 'Persistent' : 'Non-persistent'}
          </span>
        </div>
      </div>
      <div className="mt-2 text-gray-600">
        Storage usage: {usagePercentage}% ({(storageInfo.usage / 1024 / 1024).toFixed(2)} MB)
      </div>
      {!storageInfo.persistent && (
        <div className="mt-2 text-yellow-700 text-xs">
          ⚠️ Data may be cleared when browser storage is low. Persistent storage was requested but not granted.
        </div>
      )}
    </div>
  );
};

export default StorageStatus;