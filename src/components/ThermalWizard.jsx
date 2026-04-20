import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Cpu, 
  Layers, 
  Wind, 
  Zap, 
  ShieldCheck, 
  Info,
  ThermometerSnowflake,
  Fan,
  Box,
  Monitor
} from 'lucide-react';

const steps = [
  { id: 'archetype', title: 'Component', icon: <Box size={14} />, desc: 'Package Type' },
  { id: 'power', title: 'Power', icon: <Zap size={14} />, desc: 'Watts Estimate' },
  { id: 'cooling', title: 'Cooling', icon: <Wind size={14} />, desc: 'Airflow Strategy' },
  { id: 'pcb', title: 'PCB', icon: <Layers size={14} />, desc: 'Plane & Via Density' },
  { id: 'summary', title: 'Review', icon: <ShieldCheck size={14} />, desc: 'System Verdict' }
];

const ThermalWizard = ({ isOpen, onClose, onUpdate, onApply }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    archetype: 'qfn',
    power: 5.0,
    cooling: 'natural',
    pcbLayers: 4,
    viaDensity: 'none',
    voltage: 12,
    current: 0.4
  });

  // Calculate and sync with parent in real-time
  useEffect(() => {
    let rjc = 1.2;
    let rjb = 25.0;
    let rsa = 15.0;
    let rcs = 0.5;

    if (data.archetype === 'bga') { rjc = 0.8; rjb = 15; }
    if (data.archetype === 'to220') { rjc = 0.5; rjb = 40; }
    if (data.cooling === 'fan') rsa = 3.5;
    if (data.cooling === 'chassis') rsa = 1.8;
    if (data.pcbLayers > 4) rjb -= 5;
    if (data.viaDensity === 'high') rjb -= 10;

    onUpdate({
      power: data.power,
      rJC: rjc,
      rJB: rjb,
      rSA: rsa,
      rCS: rcs
    });
  }, [data, onUpdate]);

  if (!isOpen) return null;

  const next = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  const prev = () => setCurrentStep(Math.max(0, currentStep - 1));

  return (
    <div className="thermal-wizard-inline fade-in" style={{ 
      margin: '0 0 var(--space-6) 0',
      background: 'rgba(13, 27, 46, 0.4)',
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
                transition: 'all 0.4s'
              }}></div>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          style={{ marginLeft: 'var(--space-4)', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
        >
          <Monitor size={14} /> <span style={{ fontSize: '0.65rem' }}>DASHBOARD VIEW</span>
        </button>
      </div>

      {/* ── Step Content Drawer ── */}
      <div style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-12)', alignItems: 'center' }}>
        
        {/* Left: Step Interaction */}
        <div className="slide-up">
          {currentStep === 0 && (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
             {[
               { id: 'qfn', name: 'QFN/DFN', icon: <Box size={18} /> },
               { id: 'bga', name: 'SoC/BGA', icon: <Cpu size={18} /> },
               { id: 'to220', name: 'TO-220', icon: <Cpu size={18} /> }
             ].map(item => (
               <button 
                 key={item.id}
                 onClick={() => setData({...data, archetype: item.id})}
                 style={{ 
                   padding: 'var(--space-4)', 
                   borderRadius: 'var(--radius-md)', 
                   border: `2px solid ${data.archetype === item.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
                   background: data.archetype === item.id ? 'var(--accent-light)' : 'rgba(255,255,255,0.02)',
                   color: 'var(--text-primary)',
                   display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer'
                 }}
               >
                 {item.icon}
                 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.name}</span>
               </button>
             ))}
           </div>
          )}

          {currentStep === 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center' }}>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>VOLTAGE (V)</div>
                  <input 
                    type="number" value={data.voltage}
                    onChange={e => setData({...data, voltage: parseFloat(e.target.value) || 0, power: (parseFloat(e.target.value) || 0) * data.current})}
                    style={{ background: 'transparent', borderBottom: '1px solid var(--accent-primary)', color: 'var(--text-primary)', fontSize: '1.2rem', padding: '4px', width: '60px', textAlign: 'center', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none' }}
                  />
               </div>
               <div style={{ color: 'var(--text-tertiary)' }}>×</div>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>CURRENT (A)</div>
                  <input 
                    type="number" value={data.current}
                    onChange={e => setData({...data, current: parseFloat(e.target.value) || 0, power: data.voltage * (parseFloat(e.target.value) || 0)})}
                    style={{ background: 'transparent', borderBottom: '1px solid var(--accent-primary)', color: 'var(--text-primary)', fontSize: '1.2rem', padding: '4px', width: '60px', textAlign: 'center', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none' }}
                  />
               </div>
               <div style={{ fontSize: '1.5rem', color: 'var(--text-tertiary)', margin: '0 8px' }}>=</div>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>POWER</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>{data.power.toFixed(1)}W</div>
               </div>
            </div>
          )}

          {currentStep === 2 && (
             <div style={{ display: 'flex', gap: '8px' }}>
             {[
               { id: 'natural', name: 'Natural', icon: <Wind size={14} /> },
               { id: 'fan', name: 'Forced Air', icon: <Fan size={14} /> },
               { id: 'chassis', name: 'Chassis', icon: <ThermometerSnowflake size={14} /> }
             ].map(item => (
               <button 
                 key={item.id}
                 onClick={() => setData({...data, cooling: item.id})}
                 style={{ 
                   flex: 1, padding: 'var(--space-3)', 
                   borderRadius: 'var(--radius-md)', 
                   border: `1px solid ${data.cooling === item.id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                   background: data.cooling === item.id ? 'var(--accent-light)' : 'transparent',
                   color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                 }}
               >
                 {item.icon} {item.name}
               </button>
             ))}
           </div>
          )}

          {currentStep === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
               <div>
                 <div style={{ fontSize: '0.65rem', marginBottom: '8px', color: 'var(--text-tertiary)' }}>PCB LAYERS</div>
                 <div style={{ display: 'flex', gap: '4px' }}>
                    {[2, 4, 6].map(l => (
                      <button 
                        key={l} onClick={() => setData({...data, pcbLayers: l})}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-light)', background: data.pcbLayers === l ? 'var(--accent-primary)' : 'transparent', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        {l}L
                      </button>
                    ))}
                 </div>
               </div>
               <div>
                  <div style={{ fontSize: '0.65rem', marginBottom: '8px', color: 'var(--text-tertiary)' }}>THERMAL VIAS</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['none', 'high'].map(v => (
                      <button 
                        key={v} onClick={() => setData({...data, viaDensity: v})}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-light)', background: data.viaDensity === v ? 'var(--accent-primary)' : 'transparent', color: '#fff', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer' }}
                      >
                        {v}
                      </button>
                    ))}
                 </div>
               </div>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ textAlign: 'center', padding: '10px' }}>
               <div style={{ color: 'var(--success)', marginBottom: '8px' }}><CheckCircle2 size={32} style={{ margin: '0 auto' }} /></div>
               <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Strategy Applied</div>
               <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                 The visualizer has been pre-configured with professional baselines. You can now fine-tune values manually in the dashboard below.
               </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
            <button onClick={prev} disabled={currentStep === 0} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', opacity: currentStep === 0 ? 0 : 1 }}>
              <ChevronLeft size={14} /> Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button onClick={next} style={{ padding: '8px 24px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={onClose} style={{ padding: '10px 32px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--success)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                CLOSE WIZARD & DESIGN
              </button>
            )}
          </div>
        </div>

        {/* Right: Education Box */}
        <div style={{ paddingLeft: 'var(--space-6)', borderLeft: '1px solid var(--border-light)' }}>
           <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
              <Info size={16} /> <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Expert Insight</span>
           </div>
           <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {currentStep === 0 && "Package choice determines your Rθjc (Silicon-to-Case). DPAK or TO-220 packages have exposed pads that make heat removal much easier than standard leadless QFNs."}
              {currentStep === 1 && "Accuracy matters here. Most designers over-estimate power by 50%, leading to expensive cooling solutions that aren't necessary. Use real-world load currents."}
              {currentStep === 2 && "Airflow is the largest bottleneck. Natural convection is weak (15-40 C/W). Adding a small 20CFM fan can reduce your sink resistance by up to 80%."}
              {currentStep === 3 && "If your component is an SMT device, the PCB is your primary heatsink. Internal GROUND planes and via arrays can pull 40% of heat into the internal copper."}
              {currentStep === 4 && "Design Review: Your temperature rise is now calculated using a professional thermal resistance model. Toggle 'Expert' mode on the dashboard to see the parallel board path (Rθjb)."}
           </p>
        </div>
      </div>
    </div>
  );
};

export default ThermalWizard;
