import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Layers, 
  Info,
  Activity,
  Monitor,
  GitMerge,
  Cpu
} from 'lucide-react';

const steps = [
  { id: 'protocol', title: 'APPLICATION', icon: <Activity size={14} />, desc: 'Target Impedance' },
  { id: 'topology', title: 'TOPOLOGY', icon: <Layers size={14} />, desc: 'Stackup Position' },
  { id: 'fab', title: 'PCB TECH', icon: <Cpu size={14} />, desc: 'Manufacturing' },
  { id: 'summary', title: 'STRATEGY', icon: <ShieldCheck size={14} />, desc: 'Apply Settings' }
];

const ZdiffWizard = ({ isOpen, onClose, onApply }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    protocol: 'pcie', // usb, pcie, hdmi
    topology: 'microstrip', // microstrip, stripline
    fabClass: 'standard', // standard, hdi
  });

  if (!isOpen) return null;

  const next = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  const prev = () => setCurrentStep(Math.max(0, currentStep - 1));

  const updateBaseline = (newData) => {
    const baseline = {
      presetId: newData.protocol === 'usb' ? 0 : newData.protocol === 'pcie' ? 3 : 4,
      topology: newData.topology,
      w: newData.fabClass === 'hdi' ? 0.1 : 0.18,
      s: newData.fabClass === 'hdi' ? 0.1 : 0.18,
    };
    onApply(baseline);
  };

  const handleApply = () => {
    updateBaseline(data);
    onClose();
  };

  return (
    <div className="zdiff-wizard-inline fade-in" style={{ 
      margin: '0 0 var(--space-6) 0',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Stepper Bar */}
      <div style={{ 
        display: 'flex', 
        padding: 'var(--space-4)', 
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flex: 1 }}>
          {steps.map((step, idx) => (
            <div key={step.id} style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '0.7rem', 
                textTransform: 'uppercase', 
                color: idx === currentStep ? 'var(--accent-primary)' : '#94a3b8', 
                fontWeight: 700, 
                marginBottom: '4px',
                borderBottom: `2px solid ${idx === currentStep ? 'var(--accent-primary)' : '#e2e8f0'}`,
                paddingBottom: '4px'
              }}>
                {step.title}
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          style={{ 
            marginLeft: 'var(--space-4)', 
            background: 'var(--success)', 
            border: 'none', 
            color: '#fff', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.65rem',
            fontWeight: 800
          }}
        >
          <ShieldCheck size={12} /> CLOSE WIZARD
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-8)' }}>
        <div className="slide-up">
          {currentStep === 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { id: 'usb', name: 'USB 2.0 / 3.x', desc: 'Target: 90Ω', icon: <GitMerge size={18} /> },
                { id: 'pcie', name: 'PCIe / Ethernet', desc: 'Target: 100Ω', icon: <Activity size={18} /> },
                { id: 'hdmi', name: 'HDMI / DP', desc: 'Target: 100Ω', icon: <Monitor size={18} /> }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { const d = {...data, protocol: item.id}; setData(d); updateBaseline(d); }}
                  style={{ 
                    padding: 'var(--space-4)', 
                    borderRadius: 'var(--radius-md)', 
                    border: `2px solid ${data.protocol === item.id ? 'var(--accent-primary)' : '#f1f5f9'}`,
                    background: data.protocol === item.id ? 'rgba(55, 138, 221, 0.05)' : '#fff',
                    color: '#1e293b',
                    display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ color: data.protocol === item.id ? 'var(--accent-primary)' : '#64748b' }}>{item.icon}</div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.name}</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{item.desc}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { id: 'microstrip', name: 'Microstrip', desc: 'Outer Layers (Top/Bottom)', icon: <Layers size={16} /> },
                { id: 'stripline', name: 'Stripline', desc: 'Inner Embedded Layers', icon: <Layers size={16} /> }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { const d = {...data, topology: item.id}; setData(d); updateBaseline(d); }}
                  style={{ 
                    flex: 1, padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${data.topology === item.id ? 'var(--accent-primary)' : '#e2e8f0'}`,
                    background: data.topology === item.id ? 'rgba(55, 138, 221, 0.05)' : '#fff',
                    color: '#1e293b', cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
             <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { id: 'standard', name: 'Standard Fab', desc: '≥4 mil Space/Width', icon: <Zap size={16} /> },
                { id: 'hdi', name: 'HDI Fab', desc: '≤3 mil Space/Width', icon: <Cpu size={16} /> }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { const d = {...data, fabClass: item.id}; setData(d); updateBaseline(d); }}
                  style={{ 
                    flex: 1, padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${data.fabClass === item.id ? 'var(--accent-primary)' : '#e2e8f0'}`,
                    background: data.fabClass === item.id ? 'rgba(55, 138, 221, 0.05)' : '#fff',
                    color: '#1e293b', cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
               <div style={{ color: 'var(--success)', marginBottom: '12px' }}><ShieldCheck size={40} style={{ margin: '0 auto' }} /></div>
               <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Baseline Optimized</div>
               <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5' }}>
                  Targeting <strong>{data.protocol === 'usb' ? '90Ω' : '100Ω'}</strong> differential impedance using <strong>{data.topology}</strong> topology. 
                  Initial geometry set for <strong>{data.fabClass === 'hdi' ? 'HDI' : 'Standard'}</strong> fabrication rules.
               </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
            <button onClick={prev} disabled={currentStep === 0} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', background: 'transparent', color: '#64748b', cursor: 'pointer', opacity: currentStep === 0 ? 0 : 1, fontWeight: 600 }}>
              <ChevronLeft size={14} /> Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button onClick={next} style={{ padding: '8px 24px', borderRadius: '20px', border: 'none', background: 'var(--success)', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                CONTINUE <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleApply} style={{ padding: '10px 32px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--success)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                OPEN DASHBOARD
              </button>
            )}
          </div>
        </div>

        <div style={{ paddingLeft: 'var(--space-6)', borderLeft: '1px solid #e2e8f0' }}>
           <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
              <Info size={16} /> <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Engineering Note</span>
           </div>
           <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1.5' }}>
              {currentStep === 0 && "Differential impedance targets are dictated by the interface standard. Getting this wrong creates reflections and signal degradation."}
              {currentStep === 1 && "Microstrip is typically faster but radiates more EMI. Stripline requires vias but provides excellent shielding for >5 Gbps signals."}
              {currentStep === 2 && "Standard fabrication limits trace width and spacing to 4 mil (0.1 mm). High Density Interconnect (HDI) enables 3 mil or below, but significantly increases PCB cost."}
              {currentStep === 3 && "Final Step: We'll open the Dashboard View and pre-populate the solver with a baseline stackup optimized for these constraints. You can fine-tune from there."}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ZdiffWizard;
