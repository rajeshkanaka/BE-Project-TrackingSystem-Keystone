import { useState, useEffect } from 'react';
import { usePersistentStorage } from './usePersistentStorage';

// Simple file backup/restore functions
export const downloadBackup = (data: any, filename: string = 'projects-backup.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const uploadBackup = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  });
};

// Enhanced hook with automatic backup
export function useBackupStorage<T>(
  key: string, 
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void, boolean, () => void, () => Promise<void>] {
  const [value, setValue, isLoading] = usePersistentStorage<T>(key, initialValue);

  // Auto-backup function
  const downloadBackupFile = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${key}-backup-${timestamp}.json`;
    downloadBackup(value, filename);
  };

  // Restore from backup function
  const restoreFromBackup = async () => {
    try {
      const backupData = await uploadBackup();
      setValue(backupData);
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  };

  return [value, setValue, isLoading, downloadBackupFile, restoreFromBackup];
}