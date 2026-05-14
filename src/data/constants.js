import { Rocket, Car, Activity, Zap, Smartphone, Factory, ShieldCheck, Cpu, Shield, CircuitBoard, Database } from 'lucide-react';

export const INDUSTRIAL_SECTORS = [
  { id: 'Aerospace', title: 'Aerospace & Defense', icon: Rocket, color: '#3b82f6', desc: 'Focus on mission-critical Class 3 reliability standards.' },
  { id: 'Automotive', title: 'Automotive Systems', icon: Car, color: '#ef4444', desc: 'AEC-Q100 compliance and thermal-mechanical ruggedness.' },
  { id: 'Medical', title: 'Medical Electronics', icon: Activity, color: '#10b981', desc: 'Life-critical signal integrity and low-noise diagnostics.' },
  { id: 'Power', title: 'Power & Energy', icon: Zap, color: '#f59e0b', desc: 'High-voltage layout, busbars, and thermal management.' },
  { id: 'Consumer', title: 'Consumer Tech', icon: Smartphone, color: '#a855f7', desc: 'High-density interconnect (HDI) and cost-optimized layout.' },
  { id: 'Industrial', title: 'Industrial Controls', icon: Factory, color: '#6366f1', desc: 'EMI/EMC ruggedness and resilient connectivity solutions.' },
  { id: 'Military', title: 'Defense & Military', icon: ShieldCheck, color: '#4b5563', desc: 'MIL-SPEC compliance and extreme environment ruggedness.' }
];

export const DEFAULT_AVATAR_LOOKS = [
  { id: 'cpu', icon: Cpu, color: '#3b82f6', label: 'Processor' },
  { id: 'zap', icon: Zap, color: '#f59e0b', label: 'Power' },
  { id: 'shield', icon: Shield, color: '#10b981', label: 'Secure' },
  { id: 'circuit', icon: CircuitBoard, color: '#a855f7', label: 'Routing' },
  { id: 'activity', icon: Activity, color: '#ef4444', label: 'Signal' },
  { id: 'database', icon: Database, color: '#6366f1', label: 'Memory' }
];

export const getIconForAvatarUrl = (avatarUrl) => {
  if (avatarUrl && avatarUrl.startsWith('icon:')) {
    const iconId = avatarUrl.split(':')[1];
    const look = DEFAULT_AVATAR_LOOKS.find(l => l.id === iconId);
    if (look) return look;
  }
  return null;
};
