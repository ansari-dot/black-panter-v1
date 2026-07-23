import { TProject } from '../types';
import ProjectsManager from '../components/ProjectsManager';

interface ProjectsPageProps {
  projects: TProject[];
  onAddProject: (project: Partial<TProject>) => Promise<void> | void;
  onUpdateProject?: (id: string, projectData: Partial<TProject>) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  onDeleteProject: (id: string) => Promise<void> | void;
}

export default function ProjectsPage({ projects, onAddProject, onUpdateProject, onUpdateStatus, onDeleteProject }: ProjectsPageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Projects Portfolio</div>
        <div style={{ fontSize: 13, color: '#888888', marginTop: 4 }}>Manage portfolio projects displayed on the website.</div>
      </div>
      <ProjectsManager
        projects={projects}
        onAddProject={onAddProject}
        onUpdateProject={onUpdateProject}
        onUpdateStatus={onUpdateStatus}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
}
