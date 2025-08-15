import { useState, useEffect } from 'react';

// IndexedDB setup for persistent storage
const DB_NAME = 'KeystoneProjectsDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

class PersistentStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

const persistentStorage = new PersistentStorage();

// Request persistent storage permission
async function requestPersistentStorage(): Promise<boolean> {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    try {
      const granted = await navigator.storage.persist();
      console.log(`Persistent storage ${granted ? 'granted' : 'denied'}`);
      return granted;
    } catch (error) {
      console.warn('Persistent storage request failed:', error);
      return false;
    }
  }
  return false;
}

export function usePersistentStorage<T>(
  key: string, 
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(() => {
    // Try localStorage first for immediate load
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Parsing error on", saved);
      }
    }
    return initialValue instanceof Function ? initialValue() : initialValue;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and sync with IndexedDB
  useEffect(() => {
    async function initStorage() {
      try {
        // Request persistent storage
        await requestPersistentStorage();
        
        // Try to load from IndexedDB
        const persistedValue = await persistentStorage.get<T>(key);
        
        if (persistedValue !== null) {
          // Use IndexedDB data if available
          setValue(persistedValue);
          // Also update localStorage for next quick load
          localStorage.setItem(key, JSON.stringify(persistedValue));
        }
      } catch (error) {
        console.warn('Failed to load from persistent storage:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initStorage();
  }, [key]);

  // Save to both localStorage and IndexedDB on changes
  useEffect(() => {
    if (!isLoading) {
      // Save to localStorage for quick access
      localStorage.setItem(key, JSON.stringify(value));
      
      // Save to IndexedDB for persistence
      persistentStorage.set(key, value).catch(error => {
        console.warn('Failed to save to persistent storage:', error);
      });
    }
  }, [key, value, isLoading]);

  const updateValue = (newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const updatedValue = newValue instanceof Function ? newValue(prev) : newValue;
      return updatedValue;
    });
  };

  return [value, updateValue, isLoading];
}