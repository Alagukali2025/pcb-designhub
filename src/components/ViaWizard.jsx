import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  ShieldCheck, 
  Info,
  Ruler,
  Monitor,
  Activity,
  AlertTriangle
} from 'lucide-react';

const steps = [
  { id: 'tech', title: 'Technology', icon: <Layers size={14} />, desc: 'Via Archetype' },
  { id: 'integrity', title: 'Integrity', icon: <Activity size={14} />, desc: 'Signal Target' },
  { id: 'manufacturing', title: 'Standard', icon: <ShieldCheck size={14} />, desc: 'IPC Class' },
  { id: 'geometry', title: 'Geometry', icon: <Ruler size={14} />, desc: 'Physical Sizing' },
  { id: 'review', title: 'Review', icon: <CheckCircle2 size={14} />, desc: 'Strategy Verdict' }
];

const ViaWizard = ({ isOpen, onClose, onApply }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    tech: 'through', // 'through' | 'blind' | 'micro'
    speed: 'standard', // 'standard' | 'high' | 'ultra'
    ipcClass: '2', // '1' | '2' | '3'
    thickness: 1.6,
    drill: 0.2
  });

  const next = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  const prev = () => setCurrentStep(Math.max(0, currentStep - 1));

  // Reactive Sync: Update parent in real-time as data changes
  useEffect(() => {
    if (typeof onApply === 'function' && isOpen) {
      // Use a tick delay to prevent "Update during render" crashes in some React environments
      const timer = setTimeout(() => {
        onApply({
          thickness: data.thickness,
          drill: data.drill,
          mode: (data.speed === 'high' || data.speed === 'ultra') ? 'stub' : 'aspect'
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data, onApply, isOpen]);

  const handleApply = () => {
    onClose();
  };

  const getAspectLimit = () => {
    if (data.tech === 'micro') return 1;
    if (data.ipcClass === '3') return 8;
    return 10;
  };

  const currentAspect = (data.thickness / data.drill).toFixed(2);
  const isAspectRisk = currentAspect > getAspectLimit();

  // EARLY RETURN MUST BE AFTER ALL HOOKS
  if (!isOpen) return null;

  return (
    <div className="thermal-wizard-inline fade-in" style={{ 
      margin: '0 0 var(--space-6) 0',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* ── Stepper Bar ── */}
      <div style={{ 
        display: 'flex', 
        padding: 'var(--space-4)', 
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid var(--border-light)',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
          {steps.map((step, idx) => (
            <div 
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              style={{ 
                flex: 1,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: idx <= currentStep ? 'var(--accent-primary)' : 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Step {idx + 1}: {step.title}
              </div>
              <div style={{ 
                height: '4px', 
                background: idx < currentStep ? 'var(--accent-primary)' : (idx === currentStep ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)'),
                borderRadius: '2px',
                transition: 'all 0.4s',
                marginTop: '4px'
              }}></div>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          style={{ marginLeft: 'var(--space-4)', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Monitor size={14} /> <span style={{ fontSize: '0.65rem' }}>DASHBOARD VIEW</span>
        </button>
      </div>

      {/* ── Step Content Drawer ── */}
      <div className="zdiff-wizard-layout" style={{ 
        padding: 'var(--space-6)', 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 1fr) minmax(250px, 320px)', 
        gap: 'var(--space-8)', 
        alignItems: 'center' 
      }}>
        
        {/* Left: Step Interaction */}
        <div className="slide-up">
          {currentStep === 0 && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
             {[
               { id: 'through', name: 'Through-Hole', desc: 'Standard plating', icon: <Layers size={18} /> },
               { id: 'blind', name: 'Blind / Buried', desc: 'Depth controlled', icon: <Layers size={18} /> },
               { id: 'micro', name: 'Microvia', desc: 'Laser drilled', icon: <Layers size={18} /> }
             ].map(item => (
               <button 
                 key={item.id}
                 onClick={() => setData({...data, tech: item.id})}
                 style={{ 
                   padding: 'var(--space-4)', 
                   borderRadius: 'var(--radius-md)', 
                   border: `2px solid ${data.tech === item.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
                   background: data.tech === item.id ? 'var(--accent-light)' : 'rgba(255,255,255,0.02)',
                   color: 'var(--text-primary)',
                   display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                 }}
               >
                 {item.icon}
                 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.name}</span>
                 <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>{item.desc}</span>
               </button>
             ))}
           </div>
          )}

          {currentStep === 1 && (
             <div style={{ display: 'flex', gap: '8px' }}>
             {[
               { id: 'standard', name: 'Standard (< 1GHz)', icon: <Activity size={14} /> },
               { id: 'high', name: 'High Speed (< 10GHz)', icon: <Activity size={14} /> },
               { id: 'ultra', name: 'Ultra High (25G+)', icon: <Activity size={14} /> }
             ].map(item => (
               <button 
                 key={item.id}
                 onClick={() => setData({...data, speed: item.id})}
                 style={{ 
                   flex: 1, padding: 'var(--space-3)', 
                   borderRadius: 'var(--radius-md)', 
                   border: `1px solid ${data.speed === item.id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                   background: data.speed === item.id ? 'var(--accent-light)' : 'transparent',
                   color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                 }}
               >
                 {item.icon} {item.name}
               </button>
             ))}
           </div>
          )}

          {currentStep === 2 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: '1', name: 'IPC Class 1', desc: 'General Electronic Products' },
                { id: '2', name: 'IPC Class 2', desc: 'Dedicated Service' },
                { id: '3', name: 'IPC Class 3', desc: 'High Reliability' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setData({...data, ipcClass: item.id})}
                  style={{ 
                    flex: 1, padding: 'var(--space-4)', 
                    borderRadius: 'var(--radius-md)', 
                    border: `1px solid ${data.ipcClass === item.id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                    background: data.ipcClass === item.id ? 'var(--accent-light)' : 'transparent',
                    color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div>
                 <div style={{ fontSize: '0.65rem', marginBottom: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>BOARD THICKNESS (mm)</div>
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {[0.8, 1.6, 2.4].map(t => (
                      <button 
                        key={t} onClick={() => setData({...data, thickness: t})}
                        style={{ 
                          padding: '6px 14px', 
                          borderRadius: '6px', 
                          border: 'none',
                          background: data.thickness === t ? '#1a6b3a' : 'transparent', 
                          color: data.thickness === t ? '#fff' : 'var(--text-primary)', 
                          fontSize: '0.85rem', 
                          fontWeight: data.thickness === t ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {t}mm
                      </button>
                    ))}
                 </div>
               </div>
               <div>
                  <div style={{ fontSize: '0.65rem', marginBottom: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>DRILL DIAMETER (mm)</div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {[0.1, 0.15, 0.2, 0.25].map(d => (
                      <button 
                        key={d} onClick={() => setData({...data, drill: d})}
                        style={{ 
                          padding: '6px 14px', 
                          borderRadius: '6px', 
                          border: 'none',
                          background: data.drill === d ? '#1a6b3a' : 'transparent', 
                          color: data.drill === d ? '#fff' : 'var(--text-primary)', 
                          fontSize: '0.85rem', 
                          fontWeight: data.drill === d ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {d}mm
                      </button>
                    ))}
                 </div>
               </div>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ textAlign: 'center', padding: '10px' }}>
               <div style={{ color: isAspectRisk ? 'var(--danger)' : 'var(--success)', marginBottom: '8px' }}>
                  {isAspectRisk ? <AlertTriangle size={32} style={{ margin: '0 auto' }} /> : <CheckCircle2 size={32} style={{ margin: '0 auto' }} />}
               </div>
               <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                  {isAspectRisk ? 'High Manufacturing Risk' : 'Optimal Strategy Ready'}
               </div>
               <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  {isAspectRisk 
                    ? `Aspect Ratio of ${currentAspect}:1 exceeds Class ${data.ipcClass} limits for ${data.tech === 'micro' ? 'laser' : 'mechanical'} drilling.`
                    : 'Strategy validated for IPC compliance and Signal Integrity targets.'}
               </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
            <button onClick={prev} disabled={currentStep === 0} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', opacity: currentStep === 0 ? 0 : 1 }}>
              <ChevronLeft size={14} /> Back
            </button>
            {currentStep < steps.length - 1 ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button onClick={next} style={{ padding: '8px 40px', borderRadius: 'var(--radius-md)', border: 'none', background: '#1a6b3a', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Continue <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <button onClick={handleApply} style={{ padding: '10px 32px', borderRadius: 'var(--radius-md)', border: 'none', background: isAspectRisk ? 'var(--warning)' : 'var(--success)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                {isAspectRisk ? 'INJECT WITH CAUTION' : 'INJECT EXPERT STRATEGY'}
              </button>
            )}
          </div>
        </div>

        {/* Right: Education Box */}
        <div style={{ paddingLeft: 'var(--space-6)', borderLeft: '1px solid var(--border-light)' }}>
           <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: '#1a6b3a' }}>
              <Info size={16} /> <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>EXPERT INSIGHT</span>
           </div>
           <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.6', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
              {currentStep === 0 && "Through-holes are cheapest. Blind vias (connecting top to internal) or Buried vias (internal to internal) are used to save routing space on high-density boards."}
              {currentStep === 1 && (data.speed === 'high' || data.speed === 'ultra' 
                ? "At high frequencies, the 'unused' part of a through-hole via acts as a stub, causing resonance that kills signal integrity. Back-drilling or Blind vias are mandatory here."
                : "For standard signals, basic through-hole via geometry is typically transparent to the signal.")}
              {currentStep === 2 && `IPC Class ${data.ipcClass} demands specific minimum annular rings. Class 3 is for mission-critical designs where a failure is not an option (Space, Medical).`}
              {currentStep === 3 && (data.tech === 'micro' 
                ? "Microvias are laser-drilled. Industry standard aspect ratio for microvias is 0.75:1 to 1:1. Plating deeper than this becomes unreliable."
                : "Standard mechanical drills start at 0.15mm - 0.2mm. Attempting 0.1mm on a thick board significantly increases cost due to drill bit breakage.")}
              {currentStep === 4 && (isAspectRisk 
                ? "Your aspect ratio is too high. You should either increase the drill diameter, or move to a thinner dielectric/layer count to maintain manufacturability."
                : "Your design is within conservative limits. The 'Inject' action will update the main calculator to verify exact SI resonance values.")}
           </p>
        </div>
      </div>
    </div>
  );
};

export default ViaWizard;
