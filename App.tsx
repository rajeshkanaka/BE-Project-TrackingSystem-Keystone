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
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoadingStorage ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects from persistent storage...</p>
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
          <ProjectView 
            project={selectedProject}
            onUpdateProject={handleUpdateProject}
            onBack={handleUnselectProject}
          />
        )}
        {isCreating && (
          <ProjectForm 
            onSave={handleSaveProject} 
            onCancel={() => setIsCreating(false)}
          />
        )}
         {isImporting && (
          <ImportForm
            onImport={handleImportProjects}
            onCancel={() => setIsImporting(false)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;