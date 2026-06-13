/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TSystemStatus } from '../types';
import SettingsView from '../components/SettingsView';

interface SettingsPageProps {
  systemStatus: TSystemStatus;
  onUpdateStatusValue: (serviceKey: 'apiServer' | 'database' | 'cdn', state: 'Operational' | 'Degraded' | 'Offline') => void;
}

export default function SettingsPage({
  systemStatus,
  onUpdateStatusValue
}: SettingsPageProps) {
  return (
    <div id="tab-settings" className="animate-fade-in flex flex-col gap-5 font-sans">
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight font-headings">Global Configurations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage company branding profiles, social media connections, maintenance mode configurations, and administrative credentials.</p>
      </div>
      <SettingsView
        systemStatus={systemStatus}
        onUpdateStatusValue={onUpdateStatusValue}
      />
    </div>
  );
}
