import React, { useState, useMemo } from 'react';
import { ShieldCheck, Zap, Info, TrendingDown, LayoutPanelLeft, Waves, CheckCircle2 } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const PDNAnalyzer = () => {
  const [voltage, setVoltage] = useState(1.1); 
  const [ripple, setRipple] = useState(5);   
  const [current, setCurrent] = useState(10); 

  const stats = useMemo(() => {
    const vRipple = voltage * (ripple / 100);
    const zTarget = (vRipple / current) * 1000; // in mΩ

    // Cap strategy derivation
    const totalC_uF = (1 / (2 * Math.PI * 1e7 * (zTarget / 1000))) * 1e6;

    let status = 'Standard';
    let statusColor = 'var(--success)';
    
    if (zTarget < 10) {
      status = 'Extreme Performance';
      statusColor = 'var(--danger)';
    } else if (zTarget < 30) {
      status = 'Advanced Power';
      statusColor = 'var(--warning)';
    }

    const recommendations = [
      { type: 'Bulk Stage', range: '100uF - 470uF', qty: zTarget < 15 ? 2 : 1, note: 'Low-ESR Tantalum/Polymer' },
      { type: 'High-Freq', range: '0.1uF / 0402', qty: Math.ceil(50 / (zTarget / 10)), note: 'Low-ESL Ceramic (X7R/X5R)' },
      { type: 'Ultra-High', range: '10nF / 0201', qty: Math.ceil(20 / (zTarget / 10)), note: 'Interposed/Under-BGA' },
    ];

    return { vRipple, zTarget, totalC_uF, recommendations, status, statusColor };
  }, [voltage, ripple, current]);

  return (
    <div className="si-tool-card fade-in" id="pdn-target-analyzer">
      <div className="si-tool-header">
        <div className="si-tool-icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
          <TrendingDown size={24} />
        </div>
        <div>
          <h3 className="zdiff-title">PDN Target Impedance Solver</h3>
          <p className="zdiff-subtitle">Power Integrity & Noise Strategy — Rail Stability Domain</p>
        </div>
      </div>

      <div className="si-tool-grid">
        {/* Left Side: Power Specs */}
        <div className="zdiff-panel">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">DC Rail Stability Visualization</span>
             <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
                <svg viewBox="0 0 200 80" style={{ width: '100%', maxWidth: '240px' }}>
                   <path d="M20 40 L180 40" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
                   <path d="M20 40 L40 30 L60 50 L80 35 L100 45 L120 38 L140 42 L180 40" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
                   <rect x="20" y="30" width="160" height="20" fill="var(--accent-primary)" fillOpacity="0.05" />
                   <text x="100" y="20" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">+/- {ripple}% Ripple Budget</text>
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
            <div className="zdiff-input-group--full">
              <EngineeringInput
                label="Transient Current Load"
                unit="A"
                value={current}
                onChange={e => {
                  const val = e.target.value;
                  if (val === "" || isNaN(parseFloat(val))) return;
                  setCurrent(parseFloat(val));
                }}
                step="1"
                className="zdiff-input-group--orange"
              />
            </div>
            <div className="zdiff-input-group--full">
               <label className="engineering-label">Engineering Rule</label>
               <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                 "Z_target = (Voltage × Ripple%) / Current_Transient"
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Analytical Results */}
        <div className="zdiff-panel">
          <div className="zdiff-result-card" style={{ borderColor: stats.statusColor + '44' }}>
            <div className="zdiff-result-label">Z_target — Impedance Boundary</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: stats.statusColor }}>
                {stats.zTarget.toFixed(1)}
              </span>
              <span className="zdiff-result-unit">mΩ</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Ripple Budget</div>
                <div className="zdiff-result-sub-val">{stats.vRipple.toFixed(3)} <small>V</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Total Bulk C</div>
                <div className="zdiff-result-sub-val">{stats.totalC_uF.toFixed(0)} <small>µF</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Load Profile</div>
                <div className="zdiff-result-sub-val">{stats.status}</div>
              </div>
            </div>

            {/* Technical Verdict */}
            <div className={`zdiff-verdict ${stats.zTarget < 20 ? 'zdiff-verdict--warn' : 'zdiff-verdict--ok'}`}>
              <div className="zdiff-verdict-icon">
                {stats.zTarget < 20 ? <Zap size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <p className="zdiff-verdict-title">Power Stability Verdict</p>
                <p className="zdiff-verdict-body">
                  Target is {stats.zTarget.toFixed(1)} mΩ. 
                  {stats.zTarget < 15 ? ' Use ultra-low ESR polymer caps and multiple stitching vias.' : ' Standard decoupling density is sufficient.'}
                </p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box" style={{ marginTop: 'var(--space-6)' }}>
             <h5 className="zdiff-presets-title">Decoupling Strategy Stack</h5>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {stats.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-tertiary)' }}>{rec.type}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rec.range}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.6rem', background: 'rgba(26, 107, 58, 0.2)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '999px', display: 'inline-block', marginBottom: '4px' }}>QTY: {rec.qty}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{rec.note}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDNAnalyzer;
