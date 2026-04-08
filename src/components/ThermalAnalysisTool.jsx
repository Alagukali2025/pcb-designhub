import React, { useState, useMemo } from 'react';
import { Thermometer, Zap, Info, ShieldAlert, Layers, Wind } from 'lucide-react';
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

  return (
    <div className="si-tool-card fade-in">
      <div className="si-tool-header">
        <div className="si-tool-icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
          <Thermometer size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Thermal & Heat Dissipation Solver</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Copper & Via Thermal Path Engineering</p>
        </div>
      </div>

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
            <div className="zdiff-result-main-grid" style={{ marginTop: 'var(--space-2)' }}>
              <div className="zdiff-result-card text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="zdiff-result-num" style={{ color: '#EF4444' }}>{stats.rThVia.toFixed(1)} <small style={{ fontSize: '0.8rem', opacity: 0.6 }}>°C/W</small></div>
                <div className="zdiff-result-label" style={{ fontSize: '0.65rem' }}>Thermal Resistance (R_θja)</div>
              </div>
            </div>
            <p className="section-text" style={{ fontSize: '0.75rem', marginTop: 'var(--space-2)' }}>
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
            <div className="zdiff-result-main-grid" style={{ marginTop: 'var(--space-2)' }}>
              <div className="zdiff-result-card text-center" style={{ border: `1px solid ${stats.reliefColor}44` }}>
                <div className="zdiff-result-num">{stats.reliefEfficiency.toFixed(1)}%</div>
                <div className="zdiff-result-label" style={{ color: stats.reliefColor }}>{stats.reliefStatus}</div>
              </div>
            </div>
            <p className="section-text" style={{ fontSize: '0.75rem', marginTop: 'var(--space-2)' }}>
              Relief efficiency &gt; 60% leads to "cold solder joints". Balance manufacturability vs current capacity.
            </p>
          </div>
        </div>
      </div>

      <div className="zdiff-verdict zdiff-verdict--warn" style={{ marginTop: 'var(--space-4)' }}>
        <div className="zdiff-verdict-icon"><ShieldAlert size={18} /></div>
        <div style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
          <strong>Recommendation:</strong> 1oz Copper (35µm) dissipates ~0.5 W/in² for a 20°C rise. For high-power regulators, use multi-layer thermal via stitching (min. 0.3mm drill).
        </div>
      </div>
    </div>
  );
};

export default ThermalAnalysisTool;
