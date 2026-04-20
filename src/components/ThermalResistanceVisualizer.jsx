import React, { useState, useMemo } from 'react';
import { Thermometer, Wind, ShieldAlert, Layers, Cpu, Zap, Wand2 } from 'lucide-react';
import EngineeringInput from './EngineeringInput';
import ThermalWizard from './ThermalWizard';

const ThermalResistanceVisualizer = () => {
  const [power, setPower] = useState(5.0); // Watts
  const [ambient, setAmbient] = useState(25); // °C
  
  // Resistance values (C/W)
  const [rJC, setRJC] = useState(1.2); // Junction to Case
  const [rCS, setRCS] = useState(0.5); // Case to Sink (TIM)
  const [rSA, setRSA] = useState(15.0); // Sink to Ambient
  const [rJB, setRJB] = useState(25.0); // Junction to Board
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const stats = useMemo(() => {
    // High-Fidelity Model: Parallel paths (Always active)
    const rCasePath = rJC + rCS + rSA;
    const totalR = (1 / (1/rCasePath + 1/rJB));
    
    const tempRise = power * totalR;
    const junctionTemp = ambient + tempRise;
    
    let status = 'Safe';
    let color = 'var(--success)';
    
    if (junctionTemp > 125) {
      status = 'CRITICAL (FAILURE)';
      color = 'var(--danger)';
    } else if (junctionTemp > 100) {
      status = 'Warning (High)';
      color = 'var(--warning)';
    }
    
    return { totalR, junctionTemp, tempRise, status, color, rCasePath };
  }, [power, ambient, rJC, rCS, rSA, rJB]);

  const handleWizardApply = (results) => {
    setPower(results.power);
    setRJC(results.rJC);
    setRJB(results.rJB);
    setRSA(results.rSA);
    setRCS(results.rCS);
  };

  return (
    <div className="zdiff-calc fade-in" id="thermal-resistance-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <Thermometer size={18} style={{ color: '#EF4444' }} />
          </div>
          <div>
            <h3 className="zdiff-title">System Thermal Resistance (Rθ<sub>JA</sub>)</h3>
            <p className="zdiff-subtitle">Component-Level Heat Flow Path — Silicon to Ambient</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsWizardOpen(!isWizardOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[0.7rem] font-bold ${isWizardOpen ? 'bg-pcb-green text-white border-pcb-green' : 'bg-transparent text-pcb-green border-pcb-green hover:bg-pcb-green hover:text-white'}`}
          >
            <Wand2 size={12} /> {isWizardOpen ? 'EXIT WIZARD' : 'DESIGN WIZARD'}
          </button>
        </div>
      </div>

      {/* Inline Wizard Section */}
      <ThermalWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)}
        onUpdate={handleWizardApply}
      />

      <div className="zdiff-body">
        {/* ── Left Side: Inputs & Diagram ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">Thermal Stackup Visualizer</span>
             <div style={{ position: 'relative', height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Silicon Die */}
                <div style={{ 
                  width: '120px', 
                  height: '40px', 
                  background: 'linear-gradient(135deg, #FF4B2B, #FF416C)', 
                  borderRadius: '4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(255, 65, 108, 0.3)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  zIndex: 4
                }}>
                  SILICON DIE ({stats.junctionTemp.toFixed(1)}°C)
                </div>
                
                {/* Rjc path (UP) */}
                <div style={{ width: '2px', height: '30px', background: `linear-gradient(to bottom, #FF416C, #EF4444)`, opacity: 0.6 }}></div>

                {/* Device Case */}
                <div style={{ 
                  width: '160px', 
                  height: '24px', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.6rem',
                  color: 'var(--text-tertiary)',
                  zIndex: 3
                }}>
                  DEVICE CASE
                </div>

                {/* Rcs path (TIM) */}
                <div style={{ width: '160px', height: '6px', background: '#4A5568', opacity: 0.8, borderRadius: '2px', margin: '2px 0' }}></div>

                {/* Heatsink */}
                <div style={{ 
                  width: '200px', 
                  height: '50px', 
                  background: 'linear-gradient(to bottom, #4A5568, #2D3748)', 
                  clipPath: 'polygon(0% 0%, 10% 0%, 10% 100%, 20% 100%, 20% 0%, 30% 0%, 30% 100%, 40% 100%, 40% 0%, 50% 0%, 50% 100%, 60% 100%, 60% 0%, 70% 0%, 70% 100%, 80% 100%, 80% 0%, 90% 0%, 90% 100%, 100% 100%, 100% 0%, 0% 0%)',
                  zIndex: 2,
                  transform: 'rotate(180deg)',
                  opacity: 0.9
                }}></div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '-8px' }}>HEATSINK</div>

                {/* Rsa path (Ambient) */}
                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Wind size={18} style={{ color: '#63B3ED', opacity: 0.6 }} />
                  <div style={{ fontSize: '0.65rem', color: '#63B3ED' }}>AMBIENT AIR ({ambient}°C)</div>
                </div>

                {/* Always Show: Rθjb Board Path (DOWN) */}
                <div style={{ position: 'absolute', top: '155px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div style={{ width: '2px', height: '60px', borderLeft: '2px dashed #48BB78', opacity: 0.4 }}></div>
                  <div style={{ 
                    width: '180px', 
                    height: '12px', 
                    background: 'rgba(72, 187, 120, 0.05)', 
                    border: '1px solid rgba(72, 187, 120, 0.2)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.55rem',
                    color: '#48BB78',
                    fontWeight: 600
                  }}>
                    PCB GROUND PLANES (Rθjb)
                  </div>
                </div>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <EngineeringInput
              label="Power Dissipation"
              unit="Watts"
              value={power}
              onChange={e => setPower(parseFloat(e.target.value) || 0)}
              step="0.5"
            />
            <EngineeringInput
              label="Ambient Temp"
              unit="°C"
              value={ambient}
              onChange={e => setAmbient(parseFloat(e.target.value) || 0)}
              step="1"
            />
            <EngineeringInput
              label="Rθjc (Junction to Case)"
              unit="C/W"
              value={rJC}
              onChange={e => setRJC(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
            <EngineeringInput
              label="Rθcs (Case to Sink)"
              unit="C/W"
              value={rCS}
              onChange={e => setRCS(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
            <div style={{ gridColumn: 'span 2' }}>
              <EngineeringInput
                label="Rθsa (Sink to Ambient)"
                unit="C/W"
                value={rSA}
                onChange={e => setRSA(parseFloat(e.target.value) || 0)}
                step="1"
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <EngineeringInput
                label="Rθjb (Junction to Board)"
                unit="C/W"
                value={rJB}
                onChange={e => setRJB(parseFloat(e.target.value) || 0)}
                step="1"
              />
            </div>
          </div>
        </div>

        {/* ── Right Side: Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: `${stats.color}44` }}>
            <div className="zdiff-result-label">Calculated Junction Temperature</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: stats.color }}>
                {stats.junctionTemp.toFixed(1)}
              </span>
              <span className="zdiff-result-unit">°C</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Eff. Resistance</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--accent-primary)' }}>
                  {stats.totalR.toFixed(1)} <small>C/W</small>
                </div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Total Temp Rise</div>
                <div className="zdiff-result-sub-val">+{stats.tempRise.toFixed(1)} <small>°C</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Status</div>
                <div className="zdiff-result-sub-val" style={{ color: stats.color, fontWeight: 'bold' }}>{stats.status}</div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Model</div>
                <div className="zdiff-result-sub-val">Expert Dual-Path</div>
              </div>
            </div>

            {/* Technical Verdict */}
            <div className={`zdiff-verdict zdiff-verdict--ok`}>
              <div className="zdiff-verdict-icon"><ShieldAlert size={16} /></div>
              <div>
                <p className="zdiff-verdict-title">High-Fidelity Profile Active</p>
                <p className="zdiff-verdict-body">
                  Dual-path modeling (Rθjb) is standard. Accounting for board conduction provides the most reliable estimate for modern PCB designs.
                </p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Thermal Engineering Rules</h5>
             <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <ul className="m-0 p-0 pl-4 text-[0.7rem] text-tertiary list-disc space-y-1">
                   <li>Always allow a 20% safety margin below Tj_max for long-term MTBF.</li>
                   <li>Rθsa varies wildly with airflow; verify CFM with fan specifications.</li>
                   <li>For high-power SMT, the PCB is often the primary heatsink (~40% of flow).</li>
                   <li>JEDEC Rθja values are for "Comparison," not absolute prediction.</li>
                </ul>
             </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Wizard Modal */}
    </div>
  );
};

export default ThermalResistanceVisualizer;

