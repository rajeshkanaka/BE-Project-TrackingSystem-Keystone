import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectFormProps {
  onSave: (project: Omit<Project, 'id' | 'reviewData'>) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [students, setStudents] = useState('');
  const [guide, setGuide] = useState('');
  const [coGuide, setCoGuide] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !students.trim() || !guide.trim()) {
        alert("Please fill out Title, Students, and Guide fields.");
        return;
    }
    onSave({
      title,
      students: students.split(',').map(s => s.trim()).filter(Boolean),
      guide,
      coGuide,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="students" className="block text-sm font-medium text-gray-700">Student Names (comma-separated)</label>
              <input
                type="text"
                id="students"
                value={students}
                onChange={(e) => setStudents(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., John Doe, Jane Smith"
                required
              />
            </div>
            <div>
              <label htmlFor="guide" className="block text-sm font-medium text-gray-700">Guide Name</label>
              <input
                type="text"
                id="guide"
                value={guide}
                onChange={(e) => setGuide(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="coGuide" className="block text-sm font-medium text-gray-700">Co-Guide Name (Optional)</label>
              <input
                type="text"
                id="coGuide"
                value={coGuide}
                onChange={(e) => setCoGuide(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;