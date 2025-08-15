
import React from 'react';
import { ReviewStage } from '../types';

interface StageTabsProps {
  stages: ReviewStage[];
  activeStageId: string;
  onSelectStage: (stageId: string) => void;
}

const StageTabs: React.FC<StageTabsProps> = ({ stages, activeStageId, onSelectStage }) => {
  const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="mb-8">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          value={activeStageId}
          onChange={(e) => onSelectStage(e.target.value)}
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>{stage.title}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-300">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => onSelectStage(stage.id)}
                className={`
                  ${activeStageId === stage.id
                    ? 'border-slate-700 text-slate-800 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                `}
              >
                {activeStageId !== stage.id && index < stages.findIndex(s => s.id === activeStageId) && <CheckmarkIcon />}
                {stage.title}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StageTabs;