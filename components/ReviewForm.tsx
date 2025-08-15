
import React, { useState, useCallback } from 'react';
import { ReviewStage, StageFormData, QuestionEntry } from '../types';
import { getAIFeedback } from '../services/geminiService';

interface ReviewFormProps {
  stage: ReviewStage;
  formData: StageFormData;
  onDataChange: (fieldName: string, value: string, questionId?: string) => void;
}

const LoadingIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const ReviewForm: React.FC<ReviewFormProps> = ({ stage, formData, onDataChange }) => {
    const [isAILoading, setIsAILoading] = useState(false);

    const handleAIFeedback = useCallback(async () => {
        setIsAILoading(true);
        const suggestion = await getAIFeedback(formData.remarks as string || "No initial remarks provided.");
        onDataChange('remarks', suggestion);
        setIsAILoading(false);
    }, [formData.remarks, onDataChange]);


  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">{stage.title}</h2>
        <p className="mt-1 text-slate-600">{stage.description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-1/12">Sr. No.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-5/12">Question</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-2/12">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-2/12">Remark / Grade</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-2/12">Sign of Guide</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stage.questions.map((q, index) => {
              const questionData = formData[q.id] as QuestionEntry | undefined;
              return (
              <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{q.text}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="date"
                    value={questionData?.date || ''}
                    onChange={(e) => onDataChange('date', e.target.value, q.id)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    placeholder="e.g., A, B+, Satisfactory"
                    value={questionData?.grade || ''}
                    onChange={(e) => onDataChange('grade', e.target.value, q.id)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    placeholder="Guide's Name"
                    value={questionData?.guideSign || ''}
                    onChange={(e) => onDataChange('guideSign', e.target.value, q.id)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm"
                  />
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      <div className="p-6 sm:p-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Remark and Suggestions</h3>
        <div className="mt-4">
          <textarea
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            placeholder="Enter overall feedback here..."
            value={formData.remarks as string || ''}
            onChange={(e) => onDataChange('remarks', e.target.value)}
          ></textarea>
        </div>
        <div className="mt-4 flex justify-end">
            <button
                onClick={handleAIFeedback}
                disabled={isAILoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
                {isAILoading ? <LoadingIcon/> : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1h-2V5a1 1 0 00-1-1H8a1 1 0 00-1 1v1H5V4zM5 7h10v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7zm5 2a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1z" /></svg>
                )}
                {isAILoading ? 'Generating...' : 'Get AI Suggestions'}
            </button>
        </div>
      </div>
      
      <div className="p-6 sm:p-8 bg-slate-50 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Name and Sign of Reviewers</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">1.</label>
            <input
              type="text"
              placeholder="Reviewer 1 Name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              value={formData.reviewer1 as string || ''}
              onChange={(e) => onDataChange('reviewer1', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">2.</label>
            <input
              type="text"
              placeholder="Reviewer 2 Name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              value={formData.reviewer2 as string || ''}
              onChange={(e) => onDataChange('reviewer2', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
