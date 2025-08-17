
import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onStartCreate: () => void;
  onStartImport: () => void;
  onDeleteProject: (projectId: string) => void;
  onDownloadBackup: () => void;
  onRestoreBackup: () => Promise<void>;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject, onStartCreate, onStartImport, onDeleteProject, onDownloadBackup, onRestoreBackup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleRestore = async () => {
    if (window.confirm('This will replace all current projects with backup data. Continue?')) {
      try {
        await onRestoreBackup();
        alert('Backup restored successfully!');
      } catch (error) {
        alert('Failed to restore backup. Please check the file format.');
      }
    }
  };
  
  const handleDelete = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    onDeleteProject(projectId);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.guide.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.students.some(student => student.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getProjectProgress = (project: Project) => {
    const stageCount = Object.keys(project.reviewData).length;
    return Math.min((stageCount / 5) * 100, 100);
  };

  const getProjectStatus = (project: Project) => {
    const progress = getProjectProgress(project);
    if (progress === 100) return { status: 'Completed', color: 'text-teal-300', bgColor: 'bg-teal-500/20', borderColor: 'border-teal-500/30' };
    if (progress >= 60) return { status: 'Active', color: 'text-cyan-300', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/30' };
    if (progress >= 20) return { status: 'In Progress', color: 'text-blue-300', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' };
    return { status: 'Starting', color: 'text-indigo-300', bgColor: 'bg-indigo-500/20', borderColor: 'border-indigo-500/30' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Floating Header */}
      <header className="fixed top-4 left-4 right-4 bg-black/20 backdrop-blur-xl border border-cyan-500/20 rounded-2xl z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Keystone Project Tracker
              </h1>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-cyan-500/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>

              {/* Backup Buttons */}
              <button
                onClick={onDownloadBackup}
                className="p-2 bg-white/10 border border-cyan-500/30 rounded-xl hover:bg-white/20 transition-all duration-200"
                title="Download Backup"
              >
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
              </button>
              
              <button
                onClick={handleRestore}
                className="p-2 bg-white/10 border border-blue-500/30 rounded-xl hover:bg-white/20 transition-all duration-200"
                title="Restore Backup"
              >
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l3-3m0 0l-3-3m3 3H6"/>
                </svg>
              </button>

              {/* Main Action Buttons */}
              <button
                onClick={onStartCreate}
                className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
                title="New Project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
              
              <button
                onClick={onStartImport}
                className="p-2 bg-white/10 border border-cyan-500/30 rounded-xl hover:bg-white/20 transition-all duration-200"
                title="Import Projects"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-200 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-blue-300">{projects.filter(p => getProjectProgress(p) > 0 && getProjectProgress(p) < 100).length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-teal-500/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-200 mb-1">Completed</p>
                <p className="text-2xl font-bold text-teal-300">{projects.filter(p => getProjectProgress(p) === 100).length}</p>
              </div>
              <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-200 mb-1">Starting</p>
                <p className="text-2xl font-bold text-indigo-300">{projects.filter(p => getProjectProgress(p) === 0).length}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 bg-white/5 backdrop-blur-lg border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {projects.length === 0 ? 'Start your first project' : 'No projects found'}
            </h3>
            <p className="text-cyan-200 mb-8 max-w-md mx-auto">
              {projects.length === 0 
                ? 'Create a new project or import from your existing list to begin tracking progress.'
                : 'Try adjusting your search terms or clear the search to see all projects.'
              }
            </p>
            <div className="space-x-4">
              <button
                onClick={onStartCreate}
                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
              >
                Create Project
              </button>
              <button
                onClick={onStartImport}
                className="px-8 py-3 bg-white/10 border border-cyan-500/30 text-white rounded-2xl hover:bg-white/20 transition-all duration-200"
              >
                Import Projects
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => {
              const progress = getProjectProgress(project);
              const statusInfo = getProjectStatus(project);
              const stageCount = Math.min(Object.keys(project.reviewData).length, 5);
              
              return (
                <div 
                  key={project.id} 
                  className="bg-white/5 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative"
                  onClick={() => onSelectProject(project.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 truncate">{project.title}</h3>
                      <p className="text-sm text-cyan-300">by {project.students.join(', ')}</p>
                      <p className="text-sm text-blue-300">Guide: {project.guide}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}>
                      {statusInfo.status}
                    </span>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-cyan-200">Progress</span>
                      <span className="text-white font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                    </div>
                  </div>

                  {/* Stage Indicators */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index < stageCount 
                              ? 'bg-teal-400' 
                              : 'bg-slate-600'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-xs text-cyan-300">Stage {stageCount}/5</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project.id);
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-xl transition-all duration-200 mr-2"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Delete project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectList;
