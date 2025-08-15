import React, { useState } from 'react';
import { parseProjectList } from '../services/geminiService';
import { ParsedProjectEntry } from '../types';

interface ImportFormProps {
  onImport: (projects: ParsedProjectEntry[]) => void;
  onCancel: () => void;
}

const LoadingIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ImportForm: React.FC<ImportFormProps> = ({ onImport, onCancel }) => {
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!rawText.trim()) {
      setError('Please paste the project list text into the area below.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const parsedData = await parseProjectList(rawText);
      onImport(parsedData);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl transform transition-all">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Import Project Allocation List</h2>
        <p className="text-sm text-slate-600 mb-4">
          Paste the entire content of your project allocation sheet (e.g., from a PDF or spreadsheet) into the text area below. The AI will automatically extract project groups, students, and guides.
        </p>
        
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}
        
        <textarea
            rows={12}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
            placeholder="Paste your project list here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={isLoading}
        />

        <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleParse}
              disabled={isLoading}
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading && <LoadingIcon />}
              {isLoading ? 'Parsing...' : 'Parse & Import'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImportForm;
