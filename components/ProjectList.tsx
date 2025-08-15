import React from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onStartCreate: () => void;
  onStartImport: () => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject, onStartCreate, onStartImport, onDeleteProject }) => {
  
  const handleDelete = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent card click event from firing
    onDeleteProject(projectId);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="flex flex-wrap justify-between items-center mb-6 border-b pb-4 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Projects Dashboard</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={onStartImport}
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Import from List
          </button>
          <button
            onClick={onStartCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Project
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 px-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-medium text-slate-700">No projects found.</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by creating a new project or importing an allocation list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="bg-slate-50 border border-slate-200 rounded-lg p-5 cursor-pointer hover:shadow-md hover:border-indigo-400 transition-all group relative"
              onClick={() => onSelectProject(project.id)}
            >
              <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-indigo-600">{project.title}</h3>
              <p className="text-sm text-slate-500 mt-2"><strong>Guide:</strong> {project.guide}</p>
              <p className="text-sm text-slate-500 mt-1"><strong>Students:</strong> {project.students.join(', ')}</p>
               <button
                  onClick={(e) => handleDelete(e, project.id)}
                  className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;