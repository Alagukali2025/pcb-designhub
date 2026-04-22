import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Thermometer, 
  Layers, 
  Info,
  Activity,
  AlertTriangle,
  Monitor
} from 'lucide-react';

const steps = [
  { id: 'class', title: 'Application Class', icon: <ShieldCheck size={14} />, desc: 'Safety Margins' },
  { id: 'load', title: 'Load Profile', icon: <Zap size={14} />, desc: 'Current Type' },
  { id: 'reliability', title: 'Reliability', icon: <Activity size={14} />, desc: 'Voltage Drop' },
  { id: 'summary', title: 'Configure', icon: <Layers size={14} />, desc: 'Apply Settings' }
];

const TraceWizard = ({ isOpen, onClose, onUpdate, onApply }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    appClass: 'industrial', // consumer, industrial, aerospace
    loadType: 'dc', // dc, pulse
    priority: 'balanced', // space, efficiency, balanced
    ambientTemp: 25
  });

  // Real-time synchronization with parent
  React.useEffect(() => {
    if (!onUpdate) return;
    
    let tempRise = 20;
    let copperWeight = 1.0;

    if (data.appClass === 'aerospace') { tempRise = 10; copperWeight = 2.0; }
    if (data.appClass === 'consumer') { tempRise = 30; copperWeight = 0.5; }
    if (data.appClass === 'industrial') { tempRise = 20; copperWeight = 1.0; }

    onUpdate({
      tempRise: tempRise,
      ambientTemp: data.ambientTemp,
      copperWeight: copperWeight,
      loadFactor: data.loadType === 'pulse' ? 0.7 : 1.0
    });
  }, [data, onUpdate]);

  if (!isOpen) return null;

  const next = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  const prev = () => setCurrentStep(Math.max(0, currentStep - 1));

  const handleApply = () => {
    let tempRise = 20;
    if (data.appClass === 'aerospace') tempRise = 10;
    if (data.appClass === 'consumer') tempRise = 30;

    onApply({
      tempRise: tempRise,
      ambientTemp: data.ambientTemp,
      loadFactor: data.loadType === 'pulse' ? 0.7 : 1.0,
      targetDrop: data.priority === 'efficiency' ? 1 : (data.priority === 'space' ? 5 : 3)
    });
    onClose();
  };

  return (
    <div className="thermal-wizard-inline fade-in" style={{ 
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
        <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
          {steps.map((step, idx) => (
            <div key={step.id} style={{ flex: 1 }}>
              <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: idx <= currentStep ? 'var(--accent-primary)' : '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                {step.title}
              </div>
              <div style={{ 
                height: '4px', 
                background: idx <= currentStep ? 'var(--accent-primary)' : '#e2e8f0',
                borderRadius: '2px',
                transition: 'all 0.4s'
              }}></div>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          style={{ marginLeft: 'var(--space-4)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Monitor size={14} /> <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>DASHBOARD VIEW</span>
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-8)' }}>
        <div className="slide-up">
          {currentStep === 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { id: 'consumer', name: 'Consumer', desc: 'Max +30°C Rise', icon: <Zap size={18} /> },
                { id: 'industrial', name: 'Industrial', desc: 'Max +20°C Rise', icon: <ShieldCheck size={18} /> },
                { id: 'aerospace', name: 'High-Rel', desc: 'Max +10°C Rise', icon: <Activity size={18} /> }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setData({...data, appClass: item.id})}
                  style={{ 
                    padding: 'var(--space-4)', 
                    borderRadius: 'var(--radius-md)', 
                    border: `2px solid ${data.appClass === item.id ? 'var(--accent-primary)' : '#f1f5f9'}`,
                    background: data.appClass === item.id ? 'rgba(55, 138, 221, 0.05)' : '#fff',
                    color: '#1e293b',
                    display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ color: data.appClass === item.id ? 'var(--accent-primary)' : '#64748b' }}>{item.icon}</div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.name}</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{item.desc}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { id: 'dc', name: 'Continuous DC', desc: '100% Duty Cycle', icon: <Zap size={16} /> },
                { id: 'pulse', name: 'Transient/Pulse', desc: '< 20% Duty Cycle', icon: <Activity size={16} /> }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setData({...data, loadType: item.id})}
                  style={{ 
                    flex: 1, padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${data.loadType === item.id ? 'var(--accent-primary)' : '#e2e8f0'}`,
                    background: data.loadType === item.id ? 'rgba(55, 138, 221, 0.05)' : '#fff',
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
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                   <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>AMBIENT TEMPERATURE (°C)</div>
                   <input 
                      type="range" min="0" max="100" value={data.ambientTemp}
                      onChange={e => setData({...data, ambientTemp: parseInt(e.target.value)})}
                      style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                   />
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>0°C</span>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{data.ambientTemp}°C</span>
                      <span style={{ color: '#94a3b8' }}>100°C</span>
                   </div>
                </div>
                <div>
                   <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>DESIGN PRIORITY</div>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      {['Space', 'Balanced', 'Efficiency'].map(p => (
                        <button 
                          key={p} 
                          onClick={() => setData({...data, priority: p.toLowerCase()})}
                          style={{ 
                            flex: 1, padding: '8px', borderRadius: '4px', 
                            border: `1px solid ${data.priority === p.toLowerCase() ? 'var(--accent-primary)' : '#e2e8f0'}`, 
                            background: data.priority === p.toLowerCase() ? 'var(--accent-primary)' : 'transparent', 
                            color: data.priority === p.toLowerCase() ? '#fff' : '#64748b', 
                            fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600
                          }}
                        >
                          {p}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {currentStep === 3 && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
               <div style={{ color: 'var(--success)', marginBottom: '12px' }}><ShieldCheck size={40} style={{ margin: '0 auto' }} /></div>
               <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Strategy Optimized</div>
               <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5' }}>
                  Applying <strong>{data.appClass}</strong> class parameters. Target rise: {data.appClass === 'aerospace' ? '+10' : (data.appClass === 'consumer' ? '+30' : '+20')}°C.
                  Efficiency target: {data.priority === 'efficiency' ? '1%' : (data.priority === 'space' ? '5%' : '3%')} voltage drop.
               </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
            <button onClick={prev} disabled={currentStep === 0} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', background: 'transparent', color: '#64748b', cursor: 'pointer', opacity: currentStep === 0 ? 0 : 1, fontWeight: 600 }}>
              <ChevronLeft size={14} /> Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button onClick={next} style={{ padding: '8px 24px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleApply} style={{ padding: '10px 32px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--success)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                APPLY STRATEGY
              </button>
            )}
          </div>
        </div>

        <div style={{ paddingLeft: 'var(--space-6)', borderLeft: '1px solid #e2e8f0' }}>
           <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
              <Info size={16} /> <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Engineering Note</span>
           </div>
           <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1.5' }}>
              {currentStep === 0 && "Class choice dictates safety factor. High-Rel designs (Medical/Space) use +10°C limits to ensure long-term dielectric stability under thermal cycling."}
              {currentStep === 1 && "Pulse current allows higher peak loads. IPC-2152 allows for narrower traces if the duty cycle is low enough that the trace doesn't reach steady-state thermal equilibrium."}
              {currentStep === 2 && "Ambient temperature is often ignored. If your board operates in a 70°C enclosure, a 20°C rise puts your trace at 90°C — approaching the Tg of many low-cost laminates."}
              {currentStep === 3 && "Final Step: We'll configure the DC Power Analysis cards to show Voltage Drop and Power Loss based on your design priorities."}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TraceWizard;
