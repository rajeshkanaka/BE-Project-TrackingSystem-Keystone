
import React, { useState, useCallback } from 'react';
import StageTabs from './StageTabs';
import ReviewForm from './ReviewForm';
import { PROJECT_STAGES } from '../constants';
import { Project, StageFormData, QuestionEntry, ReviewStage } from '../types';

interface ProjectViewProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onBack: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onUpdateProject, onBack }) => {
  const [activeStageId, setActiveStageId] = useState<string>(PROJECT_STAGES[0].id);

  const handleDataChange = useCallback((fieldName: string, value: string, questionId?: string) => {
    const currentStageData = project.reviewData[activeStageId] || { remarks: '', reviewer1: '', reviewer2: '' };
    
    let updatedStageData: StageFormData;

    if (questionId) {
      const existingEntry = currentStageData[questionId];
      const currentQuestionData = (typeof existingEntry === 'object' && existingEntry !== null)
        ? (existingEntry as QuestionEntry)
        : { date: '', grade: '', guideSign: '' };

      const updatedQuestionData: QuestionEntry = {
        ...currentQuestionData,
        [fieldName]: value,
      };
      updatedStageData = {
        ...currentStageData,
        [questionId]: updatedQuestionData,
      };
    } else {
      updatedStageData = {
        ...currentStageData,
        [fieldName]: value,
      };
    }

    const updatedProject = {
      ...project,
      reviewData: {
        ...project.reviewData,
        [activeStageId]: updatedStageData,
      },
    };
    onUpdateProject(updatedProject);
  }, [activeStageId, project, onUpdateProject]);

  const activeStage = PROJECT_STAGES.find(stage => stage.id === activeStageId) || PROJECT_STAGES[0];
  const currentFormData = project.reviewData[activeStageId] || { remarks: '', reviewer1: '', reviewer2: '' };

  const renderStageForPrint = (stage: ReviewStage) => {
    const formData = project.reviewData[stage.id];
    if (!formData) return null;
    
    const questionEntries = Object.entries(formData).filter(([key]) => key.startsWith('q') || key.startsWith('ds') || key.startsWith('md') || key.startsWith('dc') || key.startsWith('fp'));

    return (
      <div key={stage.id} className="print-break-before">
        <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
        <p className="text-sm text-slate-600 mb-4">{stage.description}</p>
        <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700 w-1/12">Sr.</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700 w-5/12">Question</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700 w-2/12">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700 w-2/12">Grade</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700 w-2/12">Guide Sign</th>
            </tr>
          </thead>
          <tbody>
            {stage.questions.map((q, index) => {
              const data = formData[q.id] as QuestionEntry | undefined;
              return (
                <tr key={q.id}>
                  <td className="border-t px-4 py-2 text-sm">{index + 1}</td>
                  <td className="border-t px-4 py-2 text-sm">{q.text}</td>
                  <td className="border-t px-4 py-2 text-sm">{data?.date || '-'}</td>
                  <td className="border-t px-4 py-2 text-sm">{data?.grade || '-'}</td>
                  <td className="border-t px-4 py-2 text-sm">{data?.guideSign || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="mt-4 border p-4 rounded-md">
            <h4 className="font-semibold">Remarks and Suggestions:</h4>
            <p className="text-sm mt-1 whitespace-pre-wrap">{formData.remarks || 'No remarks.'}</p>
        </div>
         <div className="mt-4">
            <h4 className="font-semibold">Reviewers:</h4>
            <p className="text-sm mt-1">1. {formData.reviewer1 || '-'}</p>
            <p className="text-sm mt-1">2. {formData.reviewer2 || '-'}</p>
        </div>
      </div>
    )
  };

  return (
    <div>
        {/* Screen View */}
        <div className="no-print">
            <div className="flex justify-between items-center mb-6">
                 <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Projects
                </button>
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Print Report
                </button>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-t-xl shadow-lg border-b">
                 <h2 className="text-2xl font-bold text-slate-800">{project.title}</h2>
                 <p className="mt-2 text-sm text-slate-600"><strong>Guide:</strong> {project.guide} | <strong>Co-Guide:</strong> {project.coGuide}</p>
                 <p className="mt-1 text-sm text-slate-600"><strong>Students:</strong> {project.students.join(', ')}</p>
            </div>
            <StageTabs 
                stages={PROJECT_STAGES} 
                activeStageId={activeStageId} 
                onSelectStage={setActiveStageId} 
            />
            <ReviewForm 
                stage={activeStage}
                formData={currentFormData}
                onDataChange={handleDataChange}
            />
        </div>
        
        {/* Print View */}
        <div className="hidden print-block">
            <div className="p-4">
                <h1 className="text-3xl font-bold text-center">Final Year Project Report</h1>
                <p className="text-md text-center text-slate-600 mb-8">Keystone College of Engineering - Department of Computer Engineering</p>

                <div className="mb-8 p-4 border rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
                    <p><strong>Guide:</strong> {project.guide}</p>
                    <p><strong>Co-Guide:</strong> {project.coGuide}</p>
                    <p><strong>Students:</strong> {project.students.join(', ')}</p>
                </div>

                <div className="space-y-12">
                   {PROJECT_STAGES.map(renderStageForPrint)}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProjectView;
