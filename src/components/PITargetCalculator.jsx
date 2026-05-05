import React, { useState, useMemo } from 'react';
import { TrendingDown, Zap, ShieldAlert, Info, CheckCircle2, Waves, Wand2, ChevronRight, ChevronLeft, Activity, ShieldCheck } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const PITargetCalculator = () => {
  const [voltage, setVoltage] = useState(1.1);
  const [ripple, setRipple] = useState(5);
  const [current, setCurrent] = useState(10);

  // Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [pcbTech, setPcbTech] = useState('hdi');

  const PRESETS = {
    DDR5: { voltage: 1.1, ripple: 2, current: 6, label: "DDR5 VDDQ (Strict)" },
    PCIE5: { voltage: 0.8, ripple: 5, current: 40, label: "PCIe Gen 5 Host Core" },
    FPGA: { voltage: 0.9, ripple: 3, current: 25, label: "High-Perf FPGA Core" },
    ASIC: { voltage: 1.0, ripple: 5, current: 15, label: "General ASIC / SoC" }
  };

  const applyPreset = (key) => {
    const p = PRESETS[key];
    if (p) {
      setVoltage(p.voltage);
      setRipple(p.ripple);
      setCurrent(p.current);
    }
  };

  const stats = useMemo(() => {
    const vRipple = voltage * (ripple / 100);
    const zTarget = (vRipple / current) * 1000; // mΩ

    const status = zTarget < 10 ? 'Extreme' : zTarget < 30 ? 'Challenging' : 'Standard';
    const statusColor = zTarget < 10 ? 'var(--danger)' : zTarget < 30 ? 'var(--warning)' : 'var(--success)';
    
    // Decoupling Heuristics
    const qtyBulk = Math.ceil(current / 5);
    const qtyHighFreq = Math.max(12, Math.ceil(500 / zTarget));
    const qtyUltraHigh = Math.max(8, Math.ceil(200 / zTarget));
    const totalBulkC = (current * 2e-6) / vRipple; // F

    // Expert Feasibility Warning (Inductance Wall)
    let feasibilityWarning = null;
    if (zTarget < 5 && pcbTech === 'std') {
      feasibilityWarning = "Inductance Wall: Standard vias (0.7-1nH) will block your decoupling at these levels. Switch to HDI / Via-in-Pad to hit sub-5mΩ targets.";
    } else if (zTarget < 2) {
      feasibilityWarning = "Extreme Target: Requires multi-via mounting (2-4 vias per pad) and ultra-thin dielectric (≤ 3 mils) for plane pairs.";
    }

    return { vRipple, zTarget, status, statusColor, qtyBulk, qtyHighFreq, qtyUltraHigh, totalBulkC, feasibilityWarning };
  }, [voltage, ripple, current, pcbTech]);

  return (
    <div className="zdiff-calc slide-up" id="pi-target-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(55, 138, 221, 0.1)' }}>
            <TrendingDown size={18} style={{ color: '#378ADD' }} />
          </div>
          <div>
            <h3 className="zdiff-title">PDN Target Impedance Solver</h3>
            <p className="zdiff-subtitle">Power Integrity (PI) Limit Analysis — Transient Stability</p>
          </div>
        </div>
        <button 
          onClick={() => setIsWizardOpen(!isWizardOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[0.7rem] font-bold ${isWizardOpen ? 'bg-pcb-green text-white border-pcb-green' : 'bg-transparent text-pcb-green border-pcb-green hover:bg-pcb-green hover:text-white'}`}
        >
          <Wand2 size={12} /> {isWizardOpen ? 'CLOSE WIZARD' : 'DESIGN WIZARD'}
        </button>
      </div>

      {isWizardOpen && (
        <div className="thermal-wizard-inline fade-in" style={{ 
          margin: '0 0 var(--space-6) 0',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
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
              {['Application', 'Tolerance', 'PCB Tech', 'Strategy'].map((step, idx) => (
                <div key={step} style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: idx <= wizardStep ? '#378ADD' : '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    {step}
                  </div>
                  <div style={{ 
                    height: '4px', 
                    background: idx <= wizardStep ? '#378ADD' : '#e2e8f0',
                    borderRadius: '2px',
                    transition: 'all 0.4s'
                  }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-8)' }}>
            <div className="slide-up">
              {wizardStep === 0 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>SILICON APPLICATION</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(PRESETS).map(key => (
                        <button 
                          key={key}
                          onClick={() => applyPreset(key)}
                          style={{ 
                            padding: '10px', borderRadius: '4px', 
                            border: '1px solid #e2e8f0', 
                            background: voltage === PRESETS[key].voltage && ripple === PRESETS[key].ripple ? '#378ADD' : 'transparent', 
                            color: voltage === PRESETS[key].voltage && ripple === PRESETS[key].ripple ? '#fff' : '#64748b', 
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          {PRESETS[key].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={() => setWizardStep(1)} 
                      className="px-6 py-2 bg-pcb-green text-white rounded-lg text-[0.75rem] font-bold"
                    >
                      CONTINUE <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 1 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>RIPPLE TOLERANCE</div>
                    <div className="flex gap-2">
                      {[
                        { id: 2, label: 'Extreme (2%)' },
                        { id: 5, label: 'Standard (5%)' },
                        { id: 10, label: 'Loose (10%)' }
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => setRipple(item.id)}
                          style={{ 
                            flex: 1, padding: '10px', borderRadius: '4px', 
                            border: '1px solid #e2e8f0', 
                            background: ripple === item.id ? '#378ADD' : 'transparent', 
                            color: ripple === item.id ? '#fff' : '#64748b', 
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' 
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button onClick={() => setWizardStep(0)} className="text-[0.7rem] font-bold text-[#64748b] flex items-center gap-1"><ChevronLeft size={14} /> Back</button>
                    <button 
                      onClick={() => setWizardStep(2)} 
                      className="px-6 py-2 bg-pcb-green text-white rounded-lg text-[0.75rem] font-bold"
                    >
                      CONTINUE <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>PCB TECHNOLOGY</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'hdi', name: 'HDI (Via-in-Pad)', desc: 'Lowest loop inductance, required for PCIe Gen 5 / DDR5.' },
                        { id: 'std', name: 'Standard Multi-layer', desc: 'Standard thru-hole vias, higher inductance path.' }
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => setPcbTech(item.id)}
                          style={{ 
                            padding: '12px', borderRadius: '4px', 
                            border: '1px solid #e2e8f0', 
                            background: pcbTech === item.id ? '#378ADD' : 'transparent', 
                            color: pcbTech === item.id ? '#fff' : '#1e293b', 
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}
                        >
                          <div style={{ fontWeight: 800 }}>{item.name}</div>
                          <div style={{ fontSize: '0.65rem', color: pcbTech === item.id ? '#e2e8f0' : '#64748b', fontWeight: 400, marginTop: '4px' }}>{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button onClick={() => setWizardStep(1)} className="text-[0.7rem] font-bold text-[#64748b] flex items-center gap-1"><ChevronLeft size={14} /> Back</button>
                    <button 
                      onClick={() => setWizardStep(3)} 
                      className="px-6 py-2 bg-pcb-green text-white rounded-lg text-[0.75rem] font-bold shadow-md shadow-pcb-green/20"
                    >
                      GENERATE STRATEGY <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="text-center py-2">
                  <CheckCircle2 size={24} className="mx-auto text-pcb-green mb-2" />
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>PI Strategy Optimized</div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 16px', lineHeight: '1.4' }}>
                    Calculated Target: <strong>{stats.zTarget.toFixed(1)} mΩ</strong>.<br/>
                    The decoupling stack has been synchronized with your {ripple}% ripple budget.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => setWizardStep(2)} className="text-[0.7rem] font-bold text-[#64748b] flex items-center gap-1"><ChevronLeft size={14} /> Back</button>
                    <button 
                      onClick={() => { setIsWizardOpen(false); setWizardStep(0); }}
                      className="px-6 py-2 bg-pcb-green text-white rounded-lg text-[0.75rem] font-bold shadow-md shadow-pcb-green/20"
                    >
                      APPLY & CLOSE
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Pane: Engineering Notes */}
            <div style={{ paddingLeft: 'var(--space-6)', borderLeft: '1px solid #e2e8f0' }}>
               <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: '#378ADD' }}>
                  <Info size={16} /> <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engineering Note</span>
               </div>
               <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1.5' }}>
                  {wizardStep === 0 && "Selecting a profile automatically sets the Voltage and Transient current typical for that interface standard (e.g. DDR5 is 1.1V)."}
                  {wizardStep === 1 && "Ripple budget is your 'noise floor'. Lowering this to 2% significantly increases the number of capacitors required to meet the target."}
                  {wizardStep === 2 && "HDI technology reduces the 'loop inductance' of your decoupling caps. Without HDI, you often cannot hit sub-10mΩ targets regardless of cap count."}
                  {wizardStep === 3 && "Final Review: Ensure your capacitor placement is within 50 mils of the BGA balls to maintain the low-inductance path calculated here."}
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="zdiff-body">
        {/* ── Left Side: Inputs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box" style={{ padding: '8px 16px' }}>
             <span className="zdiff-diagram-label" style={{ fontSize: '0.6rem', marginBottom: '4px' }}>DC Rail Ripple Budget</span>
             <div className="flex justify-center">
                <svg viewBox="0 0 200 60" className="w-full max-w-[200px]" style={{ height: '60px' }}>
                   <path d="M20 30 L180 30" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
                   <path d="M20 30 L40 20 L60 40 L80 25 L100 35 L120 28 L140 32 L180 30" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
                   <rect x="20" y="20" width="160" height="20" fill="var(--accent-primary)" fillOpacity="0.05" />
                   <text x="100" y="10" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">+/- {ripple}% Ripple Limit</text>
                </svg>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <EngineeringInput
              label="Rail Voltage"
              unit="V"
              value={voltage}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setVoltage(parseFloat(val));
              }}
              step="0.1"
            />
            <EngineeringInput
              label="Max Ripple"
              unit="%"
              value={ripple}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setRipple(parseFloat(val));
              }}
              step="1"
            />
            <EngineeringInput
              label="Transient Step (ΔI)"
              unit="A"
              value={current}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setCurrent(parseFloat(val));
              }}
              step="1"
              className="zdiff-input-group--orange"
              style={{ gridColumn: 'span 2' }}
            />
            <div style={{ gridColumn: 'span 2', fontSize: '0.65rem', color: '#64748b', marginTop: '-12px', paddingLeft: '8px' }}>
              <Zap size={10} style={{ display: 'inline', marginRight: '4px' }} /> 
              Heuristic: Use 50% of peak chip current for ΔI.
            </div>
          </div>

          {/* ── Strategy Stack (Left Column) ── */}
          <div style={{ marginTop: '12px' }}>
             <h5 style={{ fontSize: '0.6rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontStyle: 'italic', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                <Waves size={14} /> DECOUPLING STRATEGY STACK
             </h5>
             <div className="grid grid-cols-3 gap-2">
                <div style={{ padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 800 }}>BULK STAGE</div>
                      <div style={{ background: '#f0f9ff', padding: '1px 5px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 800, color: '#378ADD' }}>QTY: {stats.qtyBulk}</div>
                   </div>
                   <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b' }}>100uF - 470uF</div>
                   <div style={{ fontSize: '0.5rem', color: '#94a3b8' }}>Low ESR Tantalum/Polymer</div>
                </div>
                <div style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800 }}>HIGH-FREQ</div>
                      <div style={{ background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800, color: '#10b981' }}>QTY: {stats.qtyHighFreq}</div>
                   </div>
                   <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>0.1uF / 0402</div>
                   <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Low ESL Ceramic (X7R)</div>
                </div>
                <div style={{ padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800 }}>ULTRA-HIGH</div>
                      <div style={{ background: '#f5f3ff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800, color: '#8b5cf6' }}>QTY: {stats.qtyUltraHigh}</div>
                   </div>
                   <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>10nF / 0201</div>
                   <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Interposed/Under BGA</div>
                </div>
             </div>
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: stats.statusColor + '44' }}>
            <div className="zdiff-result-label">Target Impedance (Z_target)</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: stats.statusColor }}>
                {stats.zTarget.toFixed(1)}
              </span>
              <span className="zdiff-result-unit">mΩ</span>
            </div>

            <div className="zdiff-result-sub-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Ripple Budget</div>
                <div className="zdiff-result-sub-val">{(stats.vRipple * 1000).toFixed(0)} <small>mV</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Total Bulk C</div>
                <div className="zdiff-result-sub-val">{(stats.totalBulkC * 1e6).toFixed(0)} <small>µF</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Load Profile</div>
                <div className="zdiff-result-sub-val">{stats.status}</div>
              </div>
            </div>

            {/* Unified Verdict Area */}
            <div className={`zdiff-verdict mt-4 ${stats.feasibilityWarning ? 'zdiff-verdict--danger' : 'zdiff-verdict--warn'}`} style={stats.feasibilityWarning ? { background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--danger)' } : {}}>
              <div className="zdiff-verdict-icon" style={stats.feasibilityWarning ? { background: 'var(--danger)', color: 'white' } : {}}>
                {stats.feasibilityWarning ? <ShieldAlert size={16} /> : <Zap size={16} />}
              </div>
              <div>
                <strong style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                  {stats.feasibilityWarning ? 'Physical Feasibility Warning' : 'Power Stability Verdict'}
                </strong>
                <p style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                  {stats.feasibilityWarning ? stats.feasibilityWarning : `Target is ${stats.zTarget.toFixed(1)} mΩ. ${stats.zTarget < 10 ? 'Use ultra-low ESR polymer caps and multiple stitching vias.' : 'Standard decoupling strategies are sufficient.'}`}
                </p>
              </div>
            </div>

            {/* PDN Physics Reference Card */}
            <div className="zdiff-result-card mt-3" style={{ background: 'rgba(248, 250, 252, 0.5)', borderColor: '#e2e8f0', padding: '12px' }}>
              <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                <Activity size={12} /> PDN Physics & Frequency
              </div>
              
              <div className="flex flex-col gap-3">
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>STAGE</span>
                  <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>BANDWIDTH</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e293b' }}>Bulk Stage</div>
                    <div style={{ fontSize: '0.65rem', color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>DC - 100 kHz</div>
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#94a3b8', lineHeight: 1.2 }}>Handles VRM transient response and global power dips.</div>
                </div>

                <div className="flex flex-col gap-1">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e293b' }}>High-Freq</div>
                    <div style={{ fontSize: '0.65rem', color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>100 kHz - 10 MHz</div>
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#94a3b8', lineHeight: 1.2 }}>Handles board-level switching and plane resonance.</div>
                </div>

                <div className="flex flex-col gap-1">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e293b' }}>Ultra-High</div>
                    <div style={{ fontSize: '0.65rem', color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>10 MHz - 100 MHz+</div>
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#94a3b8', lineHeight: 1.2 }}>Requires Via-in-Pad. Handles IC core switching noise.</div>
                </div>
              </div>

              <div style={{ marginTop: '16px', padding: '10px', background: 'white', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '0.6rem', color: '#378ADD', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={10} /> Expert Placement Tip
                </div>
                <div style={{ fontSize: '0.6rem', color: '#64748b', lineHeight: 1.4 }}>
                  Always place the smallest value capacitors (Ultra-High) closest to the chip pins. Inductance from just 100 mils of trace can render them useless.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PITargetCalculator;
