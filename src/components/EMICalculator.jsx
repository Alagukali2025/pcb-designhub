import React, { useState, useMemo } from 'react';
import { Zap, ShieldAlert, Waves, CheckCircle2, AlertTriangle, Ruler } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import EngineeringInput from './EngineeringInput';

const EMICalculator = () => {
  const { activeStackup } = useDesign();
  const [riseTime, setRiseTime] = useState(1); // Default 1ns
  const [trUnit, setTrUnit] = useState('ns'); // 'ns' | 'ps'
  const [distanceUnit, setDistanceUnit] = useState('mm'); // 'mm' | 'mil'
  const [traceLength, setTraceLength] = useState(50); // Default 50mm
  
  const MM_TO_MIL = 39.3701;

  const stats = useMemo(() => {
    // Standardize to ns
    const tr = trUnit === 'ns' ? riseTime : riseTime / 1000;
    if (isNaN(tr) || tr <= 0) return null;

    // Significant Frequency (Harmonic Bandwidth)
    const fmax = 0.35 / tr; // GHz
    const fmaxMhz = fmax * 1000;

    // Speed of Light in Board Material (Using SSOT Dk)
    const er = activeStackup.dk;
    const v = 300 / Math.sqrt(er); // mm/ns
    const lambda = v / fmax; // mm

    return {
      fmax: fmaxMhz,
      lambda: lambda,
      critical: lambda / 20, // Critical length mark
      antenna: lambda / 4,   // Peak radiation
    };
  }, [riseTime, trUnit, activeStackup.dk]);

  const convertDist = (val) => {
    return distanceUnit === 'mil' ? (val * MM_TO_MIL).toFixed(1) : val.toFixed(2);
  };

  const currentLengthStandardized = distanceUnit === 'mil' ? traceLength / MM_TO_MIL : traceLength;
  const isLengthCritical = stats && currentLengthStandardized >= stats.critical;
  const isLengthRadiator = stats && currentLengthStandardized >= stats.antenna;
  
  // Dynamic visual logic for SVG (0 to 180 width representing up to 2*fmax)
  const rectWidth = Math.min(90, (180 / 2)); // Fixed visual proportion for significant bandwidth

  return (
    <div className="zdiff-calc slide-up" id="emi-bandwidth-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Zap size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h3 className="zdiff-title">EMI Bandwidth & Critical Length</h3>
            <p className="zdiff-subtitle">Spectral Envelope & Radiation Analysis</p>
          </div>
        </div>

        <div className="zdiff-toggle-group">
          <button
            className={`zdiff-toggle-btn ${distanceUnit === 'mm' ? 'zdiff-toggle-btn--active-orange' : ''}`}
            onClick={() => {
              if (distanceUnit !== 'mm') {
                setDistanceUnit('mm');
                setTraceLength(+(traceLength / MM_TO_MIL).toFixed(1));
              }
            }}
          >
            mm
          </button>
          <button
            className={`zdiff-toggle-btn ${distanceUnit === 'mil' ? 'zdiff-toggle-btn--active-orange' : ''}`}
            onClick={() => {
              if (distanceUnit !== 'mil') {
                setDistanceUnit('mil');
                setTraceLength(+(traceLength * MM_TO_MIL).toFixed(1));
              }
            }}
          >
            mil
          </button>
        </div>
      </div>

      <div className="zdiff-body">
        {/* ── Left Side: Inputs & Theory ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">Spectral Envelope</span>
             <div className="flex justify-center py-6 relative">
                <svg viewBox="-40 0 240 110" className="w-full max-w-[240px]">
                   {/* Spectral curve */}
                   <path d={`M20 80 Q 50 20, 180 80`} stroke="var(--accent-primary)" strokeWidth="2" fill="none" fillOpacity="0.2" />
                   {/* Bandwidth rectangle scaled dynamically (visual representation) */}
                   <rect x="20" y="20" width={rectWidth} height="60" fill="var(--warning)" fillOpacity="0.1" />
                   <text x={20 + rectWidth/2} y="95" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">Significant Bandwidth</text>
                   <line x1="20" y1="80" x2="180" y2="80" stroke="var(--border-light)" strokeWidth="1" />
                   <line x1="20" y1="20" x2="20" y2="80" stroke="var(--border-light)" strokeWidth="1" />
                   {/* Marker for Fmax */}
                   <line x1={20 + rectWidth} y1="20" x2={20 + rectWidth} y2="80" stroke="var(--danger)" strokeWidth="1" strokeDasharray="2,2" />
                   <text x={20 + rectWidth} y="15" textAnchor="middle" fill="var(--danger)" fontSize="8">Fmax</text>
                </svg>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <div className="zdiff-input-group" style={{ gridColumn: 'span 2' }}>
              <EngineeringInput
                label="Significant Rise/Fall Time"
                unit={trUnit}
                value={riseTime}
                onChange={e => {
                  const val = e.target.value;
                  if (val === "" || isNaN(parseFloat(val))) return;
                  setRiseTime(parseFloat(val));
                }}
                step="0.01"
              />
              <div className="flex gap-2 mt-2">
                <select 
                  value={trUnit} 
                  onChange={e => setTrUnit(e.target.value)}
                  className="zdiff-toggle-btn w-full"
                  style={{ fontSize: '0.75rem' }}
                >
                  <option value="ns">ns (Nanoseconds)</option>
                  <option value="ps">ps (Picoseconds)</option>
                </select>
              </div>
            </div>
            
            <div className="zdiff-input-group" style={{ gridColumn: 'span 2', marginTop: '8px' }}>
              <EngineeringInput
                label="Actual Trace Length"
                unit={distanceUnit}
                value={traceLength}
                onChange={e => {
                  const val = e.target.value;
                  if (val === "" || isNaN(parseFloat(val))) return;
                  setTraceLength(parseFloat(val));
                }}
                step="1"
              />
            </div>
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: isLengthRadiator ? 'var(--danger-border)' : (isLengthCritical ? 'var(--warning-border)' : 'var(--accent-border)') }}>
            <div className="zdiff-result-label">fmax — Harmonic Boundary</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: 'var(--accent-primary)' }}>
                {stats ? stats.fmax.toFixed(0) : 0}
              </span>
              <span className="zdiff-result-unit">MHz</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Critical (λ/20)</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--warning)' }}>
                   {stats ? convertDist(stats.critical) : 0} <small>{distanceUnit}</small>
                </div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Resonant (λ/4)</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--danger)' }}>
                   {stats ? convertDist(stats.antenna) : 0} <small>{distanceUnit}</small>
                </div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Wavelength (λ)</div>
                <div className="zdiff-result-sub-val">
                   {stats ? convertDist(stats.lambda) : 0} <small>{distanceUnit}</small>
                </div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Length Ratio</div>
                <div className="zdiff-result-sub-val">
                   {stats ? (currentLengthStandardized / stats.lambda).toFixed(3) : 0} <small>λ</small>
                </div>
              </div>
            </div>

            {/* Design Verdict */}
            <div className={`zdiff-verdict ${isLengthRadiator ? 'zdiff-verdict--danger' : (isLengthCritical ? 'zdiff-verdict--warn' : 'zdiff-verdict--ok')}`}>
              <div className="zdiff-verdict-icon">
                {isLengthRadiator ? <AlertTriangle size={16} /> : (isLengthCritical ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />)}
              </div>
              <div>
                <p className="zdiff-verdict-title">EMI Impact Verdict</p>
                <p className="zdiff-verdict-body">
                  {isLengthRadiator 
                    ? `DANGER: Trace exceeds λ/4 peak radiation length. Extremely high risk of radiated emissions failure.`
                    : isLengthCritical
                    ? `WARNING: Trace exceeds λ/20 critical length. It is now a transmission line. Require termination & impedance control.`
                    : `SAFE: Trace is electrically short. Lumped element rules apply. Low radiation risk.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
