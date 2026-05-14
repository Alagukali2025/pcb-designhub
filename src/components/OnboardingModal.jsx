import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Rocket, 
  Car, 
  Activity, 
  Zap, 
  Smartphone, 
  Factory, 
  ShieldCheck,
  ChevronRight,
  Cpu,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { INDUSTRIAL_SECTORS } from '../data/constants';

export default function OnboardingModal() {
  const { userData, updateProfileData } = useAuth();
  const [selected, setSelected] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Don't show if not logged in or owner (Owner exclusion is handled in App.jsx but this is a fail-safe)
  if (!userData || userData.isOwner || userData.industry) return null;

  const handleComplete = async () => {
    if (!selected) return;
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await updateProfileData({
        ...userData,
        full_name: userData.name,
        industry: selected
      });
      
      if (!result.success) {
        setError(result.error || "Failed to initialize workspace. Please try again.");
      }
    } catch (err) {
      console.error("Onboarding crash:", err);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="onboarding-overlay glass-morphism fade-in">
      <div className="onboarding-modal slide-up">
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <Cpu size={32} className="accent-color" />
            <div className="logo-line" />
            <ShieldCheck size={20} className="verified-color" />
          </div>
          <h1>Welcome, Engineer</h1>
          <p>Please select your primary industrial sector to optimize your Hub experience.</p>
        </div>

        <div className="sectors-grid">
          {INDUSTRIAL_SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isSelected = selected === sector.id;
            
            return (
              <div 
                key={sector.id} 
                className={`sector-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelected(sector.id)}
                style={{ '--accent': sector.color }}
              >
                <div className="sector-icon">
                  <Icon size={28} />
                </div>
                <div className="sector-info">
                  <h3>{sector.title}</h3>
                  <p>{sector.desc}</p>
                </div>
                <div className="selection-indicator">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="onboarding-error slide-up">
            <AlertTriangle size={16} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <div className="onboarding-footer">
          <button 
            className={`onboarding-submit ${!selected ? 'disabled' : ''}`}
            onClick={handleComplete}
            disabled={!selected || isSaving}
          >
            {isSaving ? (
              <span>PROVISIONING WORKSPACE...</span>
            ) : (
              <>
                <span>INITIALIZE DASHBOARD</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
          <p className="footer-note">Selection can be modified later in your Profile Settings.</p>
        </div>
      </div>
    </div>
  );
}
