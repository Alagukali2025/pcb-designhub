import React, { useState, useMemo } from 'react';
import { Thermometer, Zap, Info, ShieldAlert, Layers, Wind, Wand2, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const ThermalAnalysisTool = () => {
  // Via Thermal Inputs
  const [thicknessMil, setThicknessMil] = useState(62);
  const [drillMil, setDrillMil] = useState(10);
  const [platingUm, setPlatingUm] = useState(25); // 1 mil ≈ 25um
  
  // Relief Inputs
  const [padMil, setPadMil] = useState(40);
  const [spokeWidthMil, setSpokeWidthMil] = useState(10);
  const [spokeCount, setSpokeCount] = useState(4);

  // Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  const stats = useMemo(() => {
    // 1. Via Thermal Resistance
    // Rth = h / (k * A)
    // k_cu = 400 W/m-K
    // h_m = thicknessMil * 2.54e-5
    // A_m2 = pi * d_m * t_m 
    const h_m = thicknessMil * 2.54e-5;
    const d_m = drillMil * 2.54e-5;
    const t_m = platingUm * 1e-6;
    const area_m2 = Math.PI * d_m * t_m;
    const rThVia = h_m / (400 * area_m2);

    // 2. Thermal Relief Efficiency
    // Ratio of copper connection to full perimeter
    const perimeter = Math.PI * (padMil * 2.54e-5);
    const totalSpokeWidth = spokeCount * (spokeWidthMil * 2.54e-5);
    const reliefEfficiency = (totalSpokeWidth / perimeter) * 100;

    let reliefStatus = 'Balanced';
    let reliefColor = 'var(--success)';
    if (reliefEfficiency > 60) {
      reliefStatus = 'High (Solderability Risk)';
      reliefColor = 'var(--danger)';
    } else if (reliefEfficiency < 15) {
      reliefStatus = 'Low (Thermal Isolation Risk)';
      reliefColor = 'var(--warning)';
    }

    return { rThVia, reliefEfficiency, reliefStatus, reliefColor };
  }, [thicknessMil, drillMil, platingUm, padMil, spokeWidthMil, spokeCount]);

  const applyWizardPreset = (preset) => {
    if (preset === 'stitching') {
      setPlatingUm(35); // Heavier plating for heat
      setSpokeCount(4);
      setSpokeWidthMil(15);
    } else if (preset === 'gardening') {
      setPlatingUm(20); // Standard plating
      setSpokeCount(2);
      setSpokeWidthMil(8);
    }
  };

  return (
    <div className="si-tool-card thermal-solver-compact fade-in">
      <div className="si-tool-header">
        <div className="si-tool-icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
          <Thermometer size={24} />
        </div>
        <div className="flex-1">
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Thermal & Heat Dissipation Solver</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Copper & Via Thermal Path Engineering</p>
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
              {['Intent', 'Geometry', 'Layout', 'Apply'].map((step, idx) => (
                <div key={step} style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: idx <= wizardStep ? 'var(--accent-primary)' : '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    {step}
                  </div>
                  <div style={{ 
                    height: '4px', 
                    background: idx <= wizardStep ? 'var(--accent-primary)' : '#e2e8f0',
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
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>DESIGN INTENT</div>
                    <div className="flex gap-2">
                      {[
                        { id: 'stitching', name: 'Thermal Stitching' },
                        { id: 'gardening', name: 'Via Gardening' }
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => applyWizardPreset(item.id)}
                          style={{ 
                            flex: 1, padding: '10px', borderRadius: '4px', 
                            border: '1px solid #e2e8f0', 
                            background: platingUm === (item.id === 'stitching' ? 35 : 20) ? 'var(--accent-primary)' : 'transparent', 
                            color: platingUm === (item.id === 'stitching' ? 35 : 20) ? '#fff' : '#64748b', 
                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' 
                          }}
                        >
                          {item.name}
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
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>DRILL GEOMETRY</div>
                    <div className="flex gap-2">
                      {[
                        { id: 8, label: '0.2mm (HDI)' },
                        { id: 12, label: '0.3mm (Std)' },
                        { id: 20, label: '0.5mm (Pwr)' }
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => setDrillMil(item.id)}
                          style={{ 
                            flex: 1, padding: '10px', borderRadius: '4px', 
                            border: '1px solid #e2e8f0', 
                            background: drillMil === item.id ? 'var(--accent-primary)' : 'transparent', 
                            color: drillMil === item.id ? '#fff' : '#64748b', 
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
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>SPOKE COUNT</div>
                      <div className="flex gap-2">
                        {[2, 4, 8].map(c => (
                          <button 
                            key={c} onClick={() => setSpokeCount(c)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: spokeCount === c ? 'var(--accent-primary)' : 'transparent', color: spokeCount === c ? '#fff' : '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>PLATING TARGET</div>
                      <div className="flex gap-2">
                        {[20, 25, 35].map(p => (
                          <button 
                            key={p} onClick={() => setPlatingUm(p)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: platingUm === p ? 'var(--accent-primary)' : 'transparent', color: platingUm === p ? '#fff' : '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            {p}µm
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button onClick={() => setWizardStep(1)} className="text-[0.7rem] font-bold text-[#64748b] flex items-center gap-1"><ChevronLeft size={14} /> Back</button>
                    <button 
                      onClick={() => setWizardStep(3)} 
                      className="px-6 py-2 bg-pcb-green text-white rounded-lg text-[0.75rem] font-bold shadow-md shadow-pcb-green/20"
                    >
                      REVIEW STRATEGY <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="text-center py-2">
                  <CheckCircle2 size={24} className="mx-auto text-pcb-green mb-2" />
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>Strategy Optimized</div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 16px', lineHeight: '1.4' }}>
                    Applying: <strong>{drillMil === 8 ? 'HDI' : 'Standard'}</strong> geometry with <strong>{platingUm}µm</strong> copper plating. 
                    Synchronized with the main solver.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => setWizardStep(2)} className="text-[0.7rem] font-bold text-[#64748b] flex items-center gap-1"><ChevronLeft size={14} /> Back</button>
                    <button 
                      onClick={() => { setIsWizardOpen(false); setWizardStep(0); }}
                      className="px-6 py-2 bg-pcb-green text-white rounded-lg text-[0.75rem] font-bold shadow-md shadow-pcb-green/20"
                    >
                      CLOSE WIZARD & DESIGN
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Pane: Engineering Notes */}
            <div style={{ paddingLeft: 'var(--space-6)', borderLeft: '1px solid #e2e8f0' }}>
               <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
                  <Info size={16} /> <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engineering Note</span>
               </div>
               <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1.5' }}>
                  {wizardStep === 0 && "Thermal Stitching relies on vertical copper area. Increasing plating from 25µm to 35µm can reduce via resistance by ~30% for high-power planes."}
                  {wizardStep === 1 && "Manufacturing limit check: Most fab houses can do 0.2mm (8mil) drills, but anything smaller often requires laser drilling, significantly increasing board cost."}
                  {wizardStep === 2 && "Spoke counts represent a trade-off. 8 spokes offer maximum thermal flow but can cause 'tombstoning' or cold joints during SMT reflow due to high heat sinking."}
                  {wizardStep === 3 && "Final Review: The solver now accounts for your chosen geometry. Verify the Thermal Resistance (Rθja) below to ensure it meets your junction temp budget."}
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="si-tool-grid">
        {/* Via Thermal Path Panel */}
        <div className="zdiff-panel">
          <h4 className="zdiff-panel-title">
            <Layers size={16} /> Via Thermal Resistance
          </h4>
          <div className="flex flex-col gap-4">
            <EngineeringInput
              label="Plating Thickness"
              unit="µm"
              value={platingUm}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setPlatingUm(parseFloat(val));
              }}
              step="1"
            />
            <div className="zdiff-result-main-grid">
              <div className="zdiff-result-card thermal-result-horizontal" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="zdiff-result-num" style={{ color: '#EF4444' }}>{stats.rThVia.toFixed(1)} <small style={{ fontSize: '0.8rem', opacity: 0.6 }}>°C/W</small></div>
                <div className="zdiff-result-label">Thermal Resistance (R_θja)</div>
              </div>
            </div>
            <p className="section-text" style={{ fontSize: '0.75rem' }}>
              Note: A thermal via array (4x4) will reduce this to ~{ (stats.rThVia / 16).toFixed(1) } °C/W.
            </p>
          </div>
        </div>

        {/* Copper Relief Panel */}
        <div className="zdiff-panel">
          <h4 className="zdiff-panel-title">
            <Wind size={16} /> Thermal Relief Logic
          </h4>
          <div className="flex flex-col gap-4">
            <div className="zdiff-input-grid">
              <EngineeringInput
                label="Spoke Width"
                unit="mil"
                value={spokeWidthMil}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || isNaN(parseFloat(val))) return;
                  setSpokeWidthMil(parseFloat(val));
                }}
                step="1"
              />
              <EngineeringInput
                label="Spoke Count"
                value={spokeCount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || isNaN(parseInt(val))) return;
                  setSpokeCount(parseInt(val));
                }}
                step="1"
              />
            </div>
            <div className="zdiff-result-main-grid">
              <div className="zdiff-result-card thermal-result-horizontal" style={{ border: `1px solid ${stats.reliefColor}44` }}>
                <div className="zdiff-result-num">{stats.reliefEfficiency.toFixed(1)}%</div>
                <div className="zdiff-result-label" style={{ color: stats.reliefColor }}>{stats.reliefStatus}</div>
              </div>
            </div>
            <p className="section-text" style={{ fontSize: '0.75rem' }}>
              Relief efficiency &gt; 60% leads to "cold solder joints". Balance manufacturability vs current capacity.
            </p>
          </div>
        </div>
      </div>

      <div className="zdiff-verdict zdiff-verdict--warn">
        <div className="zdiff-verdict-icon"><ShieldAlert size={18} /></div>
        <div style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
          <strong>Recommendation:</strong> 1oz Copper (35µm) dissipates ~0.5 W/in² for a 20°C rise. For high-power regulators, use multi-layer thermal via stitching (min. 0.3mm drill).
        </div>
      </div>
    </div>
  );
};

export default ThermalAnalysisTool;
