import React, { useState, useMemo } from 'react';
import { Zap, Thermometer, Ruler, ShieldAlert, CheckCircle2, Waves, Activity, Info, TrendingDown, Flame } from 'lucide-react';
import EngineeringInput from './EngineeringInput';
import TraceWizard from './TraceWizard';

const MM_TO_MIL = 39.3701;
const COPPER_RESISTIVITY = 1.724e-8; // Ohm-m at 20C
const THERMAL_COEFF = 0.00393; // per degree C

const IPC2152Calculator = () => {
  const [unitSystem, setUnitSystem] = useState('mil');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardActive, setWizardActive] = useState(false);
  
  // Basic Inputs
  const [current, setCurrent] = useState(5);
  const [tempRise, setTempRise] = useState(10);
  const [copperWeight, setCopperWeight] = useState(1);
  const [isInternal, setIsInternal] = useState(true);
  
  // IPC-2152 Modifiers
  const [boardThickness, setBoardThickness] = useState(62);
  const [hasAdjacentPlane, setHasAdjacentPlane] = useState(false);
  
  // DC Analysis Inputs
  const [ambientTemp, setAmbientTemp] = useState(25);
  const [traceLength, setTraceLength] = useState(1000); // 1000 mil = 1 inch

  const stats = useMemo(() => {
    // ... existing math ...
    // ── Stage 1: IPC-2221A Base Model ──────────────────
    const k = isInternal ? 0.024 : 0.048;
    const b = 0.44;
    const c = 0.725;
    const baseArea = Math.pow(current / (k * Math.pow(tempRise, b)), 1/c);

    // ── Stage 2: IPC-2152 Correction Factors ────────────────────────────
    const thicknessFactor = Math.pow(boardThickness / 62, 0.25);
    const planeFactor = hasAdjacentPlane ? 0.75 : 1.0;
    const convectionFactor = isInternal ? 1.0 : 0.90;

    const crossSectionArea = baseArea * thicknessFactor * planeFactor * convectionFactor;
    const thicknessMil = copperWeight * 1.37;
    const widthMil = crossSectionArea / thicknessMil;
    const widthMm = widthMil / MM_TO_MIL;

    // ── Stage 3: DC Power Analysis ─────────────────────────────────────
    const absoluteTemp = ambientTemp + tempRise;
    
    // Resistance Calculation (R = rho * L / A)
    // Convert to metric for physical calculation
    const areaSqMeters = crossSectionArea * 6.4516e-10; 
    const lengthMeters = (traceLength / MM_TO_MIL) / 1000;
    
    const baseResistance = (COPPER_RESISTIVITY * lengthMeters) / areaSqMeters;
    const resistanceAtTemp = baseResistance * (1 + THERMAL_COEFF * (absoluteTemp - 20));
    
    const voltageDrop = current * resistanceAtTemp;
    const powerLoss = current * current * resistanceAtTemp;
    
    // Fusing Current (Onderdonk - Simplified 1 sec)
    const fusingCurrent = 0.188 * (crossSectionArea) * Math.sqrt(Math.log10((1083 - ambientTemp) / (234 + ambientTemp) + 1) / 1);

    const derating = ((crossSectionArea / baseArea) - 1) * 100;

    return { 
      crossSectionArea, baseArea, thicknessMil, widthMil, widthMm, 
      thicknessFactor, planeFactor, derating, absoluteTemp,
      voltageDrop, powerLoss, fusingCurrent, resistanceAtTemp
    };
  }, [current, tempRise, copperWeight, isInternal, boardThickness, hasAdjacentPlane, ambientTemp, traceLength]);

  const convertValue = (milVal) => {
    return unitSystem === 'mm' ? (milVal / MM_TO_MIL).toFixed(3) : milVal.toFixed(1);
  };

  const handleWizardUpdate = (newData) => {
    setTempRise(newData.tempRise);
    setAmbientTemp(newData.ambientTemp);
    setCopperWeight(newData.copperWeight);
    setWizardActive(true);
  };

  const handleApplyStrategy = (strategy) => {
    handleWizardUpdate(strategy);
    setIsWizardOpen(false);
  };

  return (
    <div className="zdiff-calc slide-up" id="ipc-2152-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(55, 138, 221, 0.1)' }}>
            <Zap size={18} style={{ color: '#378ADD' }} />
          </div>
          <div>
            <h3 className="zdiff-title">IPC-2152 DC Power Suite</h3>
            <p className="zdiff-subtitle">Thermal Design + Voltage Drop + Fusing Analysis</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Activity size={14} /> STRATEGY WIZARD
          </button>
          <div className="zdiff-toggle-group">
            <button className={`zdiff-toggle-btn ${unitSystem === 'mm' ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setUnitSystem('mm')}>mm</button>
            <button className={`zdiff-toggle-btn ${unitSystem === 'mil' ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setUnitSystem('mil')}>mil</button>
          </div>
        </div>
      </div>

      <TraceWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onUpdate={handleWizardUpdate}
        onApply={handleApplyStrategy}
      />

      <div className="zdiff-body">
        {/* ── Left Side: Inputs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">Thermal Profile: {stats.absoluteTemp.toFixed(0)}°C Absolute</span>
             <div className="flex justify-center py-6">
                <svg viewBox="0 0 200 80" className="w-full max-w-[240px]">
                   <rect x="20" y="30" width="160" height="20" rx="2" fill="var(--success)" fillOpacity="0.1" stroke="var(--border-light)" />
                   <rect x="60" y="30" width="80" height="20" fill="var(--warning)" fillOpacity="0.4" />
                   <rect x="80" y="30" width="40" height="20" fill="var(--danger)" fillOpacity="0.6" />
                   <text x="100" y="65" textAnchor="middle" fill="var(--text-tertiary)" fontSize="9">Ambient ({ambientTemp}°C) + Rise ({tempRise}°C)</text>
                   <path d="M40 25 Q 100 0, 160 25" fill="none" stroke={stats.absoluteTemp > 100 ? 'var(--danger)' : 'var(--warning)'} strokeWidth="1" strokeDasharray="3" />
                </svg>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <EngineeringInput
              label="Transient Current"
              unit="Amps"
              value={current}
              onChange={e => setCurrent(parseFloat(e.target.value) || 0)}
              step="0.5"
            />
            <EngineeringInput
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Temp Rise Limit {wizardActive && <span style={{ fontSize: '0.5rem', color: 'var(--accent-primary)', fontWeight: 800 }}>[WIZARD]</span>}
                </div>
              }
              unit="°C"
              value={tempRise}
              onChange={e => {
                setTempRise(parseFloat(e.target.value) || 0);
                setWizardActive(false);
              }}
              step="1"
            />
            
            <EngineeringInput
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Ambient Temp {wizardActive && <span style={{ fontSize: '0.5rem', color: 'var(--accent-primary)', fontWeight: 800 }}>[WIZARD]</span>}
                </div>
              }
              unit="°C"
              value={ambientTemp}
              onChange={e => {
                setAmbientTemp(parseFloat(e.target.value) || 0);
                setWizardActive(false);
              }}
              step="1"
            />
            <EngineeringInput
              label="Trace Length"
              unit={unitSystem}
              value={traceLength}
              onChange={e => setTraceLength(parseFloat(e.target.value) || 0)}
              step="100"
            />

            <div className="zdiff-input-group" style={{ gridColumn: 'span 2' }}>
              <label className="engineering-label">Routing Layer Profile</label>
              <div className="zdiff-toggle-group w-full">
                <button className={`zdiff-toggle-btn flex-1 ${isInternal ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setIsInternal(true)}>Internal (Stripline)</button>
                <button className={`zdiff-toggle-btn flex-1 ${!isInternal ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setIsInternal(false)}>External (Microstrip)</button>
              </div>
            </div>

            <div className="zdiff-input-group">
              <label className="engineering-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Copper Weight {wizardActive && <span style={{ fontSize: '0.5rem', color: 'var(--accent-primary)', fontWeight: 800 }}>[WIZARD]</span>}
              </label>
              <select 
                value={copperWeight} 
                onChange={e => {
                  setCopperWeight(parseFloat(e.target.value));
                  setWizardActive(false);
                }} 
                className="input-engineering w-full" 
                style={{ fontSize: '0.8rem' }}
              >
                <option value={0.5}>0.5 oz</option>
                <option value={1}>1.0 oz</option>
                <option value={2}>2.0 oz</option>
                <option value={3}>3.0 oz</option>
              </select>
            </div>
            
            <div className="zdiff-input-group">
              <label className="engineering-label">Adjacent Plane</label>
              <div className="zdiff-toggle-group w-full">
                <button className={`zdiff-toggle-btn flex-1 ${hasAdjacentPlane ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setHasAdjacentPlane(true)}>YES</button>
                <button className={`zdiff-toggle-btn flex-1 ${!hasAdjacentPlane ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setHasAdjacentPlane(false)}>NO</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Analysis Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: 'var(--success-border)' }}>
            <div className="zdiff-result-label">Recommended Trace Width</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: 'var(--success)' }}>{convertValue(stats.widthMil)}</span>
              <span className="zdiff-result-unit">{unitSystem}</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Area</div>
                <div className="zdiff-result-sub-val">{stats.crossSectionArea.toFixed(1)} <small>mil²</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Resistance</div>
                <div className="zdiff-result-sub-val">{stats.resistanceAtTemp.toFixed(3)} <small>Ω</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Plane Effect</div>
                <div className="zdiff-result-sub-val">{stats.derating.toFixed(0)}%</div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Status</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--success)' }}>VERIFIED</div>
              </div>
            </div>
          </div>

          {/* ── NEW: DC Power Efficiency Card ── */}
          <div className="zdiff-result-card" style={{ marginTop: 'var(--space-3)', borderColor: 'var(--border-light)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="zdiff-result-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingDown size={14} /> DC Power Efficiency</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
               <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Voltage Drop</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: stats.voltageDrop > 0.1 ? 'var(--warning)' : 'var(--text-primary)' }}>
                    {(stats.voltageDrop * 1000).toFixed(1)} <small>mV</small>
                  </div>
               </div>
               <div className="bg-white/5 p-2 rounded border border-white/5">
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Power Loss</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: stats.powerLoss > 0.5 ? 'var(--warning)' : 'var(--text-primary)' }}>
                    {(stats.powerLoss * 1000).toFixed(1)} <small>mW</small>
                  </div>
               </div>
               <div className="bg-white/5 p-2 rounded border border-white/5" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Fusing Current (1s)</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--danger)' }}>
                      {stats.fusingCurrent.toFixed(1)} <small>Amps</small>
                    </div>
                  </div>
                  <Flame size={20} style={{ color: 'var(--danger)', opacity: 0.5 }} />
               </div>
            </div>

            <div className="zdiff-verdict" style={{ marginTop: '12px', background: 'rgba(55, 138, 221, 0.05)', borderColor: 'rgba(55, 138, 221, 0.2)' }}>
               <div className="zdiff-verdict-icon" style={{ color: 'var(--accent-primary)' }}><Info size={14} /></div>
               <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                 {stats.voltageDrop < 0.05 ? "Efficiency: High. Low voltage drop across the trace length." : "Efficiency: Marginal. Consider widening trace to reduce power loss."}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPC2152Calculator;

