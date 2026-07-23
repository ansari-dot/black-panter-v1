import { TSystemStatus } from '../types';
import SettingsView from '../components/SettingsView';

interface SettingsPageProps {
  systemStatus: TSystemStatus;
  onUpdateStatusValue: (serviceKey: 'apiServer' | 'database' | 'cdn', state: 'Operational' | 'Degraded' | 'Offline') => void;
}

export default function SettingsPage({ systemStatus, onUpdateStatusValue }: SettingsPageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Inter, sans-serif' }}>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 13, color: '#8a8a8a' }}>Configure organization branding, security credentials, social channels, and system services</div>
      </div>
      <SettingsView
        systemStatus={systemStatus}
        onUpdateStatusValue={onUpdateStatusValue}
      />
    </div>
  );
}

