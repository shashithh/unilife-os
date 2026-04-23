import React, { useState } from 'react';
import { GroupHome } from './GroupHome';
import { CreateProject } from './CreateProject';
import { ProjectDashboard } from './ProjectDashboard';

export function GroupCollaboration() {
  const [view, setView] = useState('home');
  const [activeProject, setActiveProject] = useState(null);

  const renderView = () => {
    switch (view) {
      case 'home':
        return <GroupHome setView={setView} setActiveProject={setActiveProject} />;
      case 'create':
        return <CreateProject setView={setView} />;
      case 'project':
        return <ProjectDashboard project={activeProject} setView={setView} />;
      default:
        return <GroupHome setView={setView} setActiveProject={setActiveProject} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      {renderView()}
    </div>
  );
}
