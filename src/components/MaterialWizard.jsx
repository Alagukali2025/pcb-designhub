import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Layers, 
  Waves,
  ShieldCheck,
  Info,
  AlertTriangle,
  Monitor,
  DollarSign
} from 'lucide-react';

const steps = [
  { id: 'speed', title: 'Data Rate', icon: <Zap size={14} />, desc: 'Signal Speed' },
  { id: 'strategy', title: 'Routing', icon: <Waves size={14} />, desc: 'Layout Style' },
  { id: 'tech', title: 'Technology', icon: <Layers size={14} />, desc: 'Stackup Type' },
  { id: 'review', title: 'Verdict', icon: <CheckCircle2 size={14} />, desc: 'Material Choice' }
];

const MaterialWizard = ({ isOpen, onClose, onApply }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    speed: '25', // '5' | '10' | '25' | '56' | '112'
    strategy: 'straight', // 'straight' | 'zigzag' | 'angled'
    tech: 'rigid' // 'rigid' | 'hdi'
  });

  if (!isOpen) return null;

  const next = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  const prev = () => setCurrentStep(Math.max(0, currentStep - 1));

  const getRecommendation = () => {
    const speedNum = parseInt(data.speed);
    
    if (speedNum >= 56) return { style: '1067', cost: 'Premium', reason: 'Ultra-high speed requires the tightest possible weave (Spread Glass) to prevent phase skew.' };
    if (speedNum >= 25) {
      if (data.strategy === 'straight') return { style: '1067', cost: 'Premium', reason: 'Straight routing at 25G+ is high risk without spread glass (1067).' };
      return { style: '1078', cost: 'High', reason: '25G with mitigation allows for slightly more cost-effective 1078 glass.' };
    }
    if (speedNum >= 10) return { style: '1080', cost: 'Mid', reason: '10G signals are balanced well by 1080-style fabrics.' };
    if (data.tech === 'hdi') return { style: '2116', cost: 'Low', reason: 'Standard HDI prepreg is sufficient for lower speeds.' };
    return { style: '7628', cost: 'Economy', reason: 'Cost-effective heavy weave for non-critical signals.' };
  };

  const recommendation = getRecommendation();

  const handleApply = () => {
    onApply(recommendation.style);
    onClose();
  };

  return (
    <div className="thermal-wizard-inline fade-in" style={{ 
      margin: '0 0 var(--space-6) 0',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Stepper Bar */}
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
                gap: '4px'
              }}
            >
              <div style={{ 
                fontSize: '0.6rem', 
                textTransform: 'uppercase', 
                color: idx <= currentStep ? 'var(--accent-secondary)' : 'var(--text-tertiary)', 
                fontWeight: 700, 
                letterSpacing: '0.05em' 
              }}>
                {step.title}
              </div>
              <div style={{ 
                height: '4px', 
                background: idx <= currentStep ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.05)',
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
          <Monitor size={14} />
        </button>
      </div>

      <div className="zdiff-wizard-layout" style={{ 
        padding: 'var(--space-6)', 
        display: 'grid', 
        gridTemplateColumns: '1fr 300px', 
        gap: 'var(--space-8)', 
        alignItems: 'center' 
      }}>
        
        {/* Step Interaction */}
        <div className="slide-up">
          {currentStep === 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['5', '10', '25', '56', '112'].map(s => (
                <button 
                  key={s}
                  onClick={() => setData({...data, speed: s})}
                  style={{ 
                    flex: '1 1 80px', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', 
                    border: `1px solid ${data.speed === s ? 'var(--accent-secondary)' : 'var(--border-light)'}`,
                    background: data.speed === s ? 'rgba(200, 117, 51, 0.1)' : 'transparent',
                    color: 'var(--text-primary)', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800 }}>{s}G</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>bps</div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'straight', name: 'Straight', desc: 'Standard Routing' },
                { id: 'zigzag', name: 'Zig-Zag', desc: 'Serpentine Path' },
                { id: 'angled', name: '10° Panel', desc: 'Rotated Weave' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setData({...data, strategy: item.id})}
                  style={{ 
                    padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', 
                    border: `1px solid ${data.strategy === item.id ? 'var(--accent-secondary)' : 'var(--border-light)'}`,
                    background: data.strategy === item.id ? 'rgba(200, 117, 51, 0.1)' : 'transparent',
                    color: 'var(--text-primary)', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'rigid', name: 'Standard Rigid', desc: 'Through-hole core' },
                { id: 'hdi', name: 'HDI / Microvia', desc: 'Thin dielectric' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setData({...data, tech: item.id})}
                  style={{ 
                    flex: 1, padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', 
                    border: `1px solid ${data.tech === item.id ? 'var(--accent-secondary)' : 'var(--border-light)'}`,
                    background: data.tech === item.id ? 'rgba(200, 117, 51, 0.1)' : 'transparent',
                    color: 'var(--text-primary)', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '0.65rem', color: 'var(--accent-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>Recommended Strategy</div>
               <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)', margin: '10px 0' }}>{recommendation.style}</div>
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{recommendation.reason}</p>
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={14} style={{ color: recommendation.cost === 'Premium' ? 'var(--danger)' : 'var(--success)' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>COST: {recommendation.cost}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>SI OPTIMIZED</span>
                  </div>
               </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
            <button onClick={prev} disabled={currentStep === 0} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', opacity: currentStep === 0 ? 0 : 1 }}>
              <ChevronLeft size={14} /> Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button onClick={next} style={{ padding: '8px 24px', borderRadius: '6px', border: 'none', background: 'var(--accent-secondary)', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Next Step <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleApply} style={{ padding: '10px 32px', borderRadius: '6px', border: 'none', background: 'var(--accent-secondary)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                APPLY MATERIAL SELECTION
              </button>
            )}
          </div>
        </div>

        {/* Expert Insight */}
        <div style={{ paddingLeft: 'var(--space-6)', borderLeft: '1px solid var(--border-light)' }}>
           <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: 'var(--accent-secondary)' }}>
              <Info size={16} /> <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Expert Insight</span>
           </div>
           <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {currentStep === 0 && "Higher data rates have shorter unit intervals (UI). This means even 5ps of skew can consume 25% of your total timing budget at 56Gbps."}
              {currentStep === 1 && "Zig-zag routing forces the signal to cross glass bundles multiple times, averaging out the Dk. 10° rotation is the 'gold standard' but wastes board space."}
              {currentStep === 2 && "HDI stackups use thinner dielectrics. The thinner the material, the more the glass weave profile dominates the electrical performance."}
              {currentStep === 3 && "This recommendation balances signal integrity risk against manufacturing costs. Spread glass (1067) is technically superior but more expensive than 2116."}
           </p>
        </div>
      </div>
    </div>
  );
};

export default MaterialWizard;
