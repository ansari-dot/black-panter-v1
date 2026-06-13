import ProjectsManager from '../components/ProjectsManager';
import { TProject } from '../types';

interface ProjectsPageProps {
  projects: TProject[];
  onAddProject: (project: Partial<TProject>) => Promise<void> | void;
  onUpdateProject?: (id: string, projectData: Partial<TProject>) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  onDeleteProject: (id: string) => Promise<void> | void;
}

export default function ProjectsPage({ projects, onAddProject, onUpdateProject, onUpdateStatus, onDeleteProject }: ProjectsPageProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Projects</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage portfolio projects displayed on the homepage.</p>
        </div>
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
