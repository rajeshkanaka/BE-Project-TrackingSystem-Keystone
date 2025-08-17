import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectList from './components/ProjectList';
import ProjectView from './components/ProjectView';
import ProjectForm from './components/ProjectForm';
import ImportForm from './components/ImportForm';
import { Project, ParsedProjectEntry } from './types';
import { useBackupStorage } from './hooks/useBackupStorage';

const App: React.FC = () => {
  const [projects, setProjects, isLoadingStorage, downloadBackup, restoreBackup] = useBackupStorage<Project[]>('projects', []);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleUnselectProject = () => {
    setSelectedProjectId(null);
  };

  const handleSaveProject = (project: Omit<Project, 'id' | 'reviewData'>) => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      ...project,
      reviewData: {},
    };
    setProjects(prev => [...prev, newProject]);
    setIsCreating(false);
  };

  const handleImportProjects = (parsedEntries: ParsedProjectEntry[]) => {
    const projectMap = new Map<string, Omit<Project, 'id' | 'reviewData'>>();

    parsedEntries.forEach(entry => {
        const key = entry.grpNo || entry.projectDomain;
        if (!key) return;

        if (!projectMap.has(key)) {
            projectMap.set(key, {
                title: entry.projectDomain,
                guide: entry.guide,
                coGuide: entry.coGuide,
                students: [],
            });
        }
        const project = projectMap.get(key)!;
        project.students.push(entry.studentName);
    });

    const newProjects: Project[] = Array.from(projectMap.values()).map((p, index) => ({
        ...p,
        id: `proj_import_${Date.now()}_${index}`,
        reviewData: {},
    }));

    setProjects(prev => [...prev, ...newProjects]);
    setIsImporting(false);
  };
  
  const handleUpdateProject = useCallback((updatedProject: Project) => {
    setProjects(prevProjects => 
      prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  }, [setProjects]);

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setSelectedProjectId(null);
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {isLoadingStorage ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-cyan-200">Loading projects from persistent storage...</p>
          </div>
        </div>
      ) : !selectedProject ? (
        <ProjectList 
          projects={projects} 
          onSelectProject={handleSelectProject}
          onStartCreate={() => setIsCreating(true)}
          onStartImport={() => setIsImporting(true)}
          onDeleteProject={handleDeleteProject}
          onDownloadBackup={downloadBackup}
          onRestoreBackup={restoreBackup}
        />
      ) : (
        <div>
          <div className="fixed top-4 left-4 right-4 bg-black/20 backdrop-blur-xl border border-cyan-500/20 rounded-2xl z-50">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">K</span>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Keystone Project Tracker
                  </h1>
                </div>
                <button
                  onClick={handleUnselectProject}
                  className="p-2 bg-white/10 border border-cyan-500/30 rounded-xl hover:bg-white/20 transition-all duration-200"
                  title="Back to Dashboard"
                >
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="pt-24">
            <ProjectView 
              project={selectedProject}
              onUpdateProject={handleUpdateProject}
              onBack={handleUnselectProject}
            />
          </div>
        </div>
      )}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <ProjectForm 
              onSave={handleSaveProject} 
              onCancel={() => setIsCreating(false)}
            />
          </div>
        </div>
      )}
       {isImporting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <ImportForm
              onImport={handleImportProjects}
              onCancel={() => setIsImporting(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;