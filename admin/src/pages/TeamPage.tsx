/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TTeamMember } from '../types';
import TeamManager from '../components/TeamManager';

interface TeamPageProps {
  team: TTeamMember[];
  onAddMember: (name: string, role: string, email: string, status: 'Active' | 'On Leave', image?: string) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'On Leave') => Promise<void> | void;
  onDeleteMember: (id: string) => Promise<void> | void;
}

export default function TeamPage({
  team,
  onAddMember,
  onUpdateStatus,
  onDeleteMember
}: TeamPageProps) {
  return (
    <div id="tab-team" className="animate-fade-in flex flex-col gap-5 font-sans">
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight">Management Team</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Control administrative placement, roles, and real-time active status rosters.</p>
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
