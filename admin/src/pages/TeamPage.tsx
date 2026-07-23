import { TTeamMember } from '../types';
import TeamManager from '../components/TeamManager';

interface TeamPageProps {
  team: TTeamMember[];
  onAddMember: (name: string, role: string, email: string, status: 'Active' | 'On Leave', image?: string) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'On Leave') => Promise<void> | void;
  onDeleteMember: (id: string) => Promise<void> | void;
}

export default function TeamPage({ team, onAddMember, onUpdateStatus, onDeleteMember }: TeamPageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Management Team</h1>
        <p style={{ fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 0 }}>Control administrative placement, roles, and real-time active status.</p>
      </div>
      <TeamManager
        team={team}
        onAddMember={onAddMember}
        onUpdateStatus={onUpdateStatus}
        onDeleteMember={onDeleteMember}
      />
    </div>
  );
}
