import React, { useState, useMemo } from 'react';
import { Activity, Zap, ShieldAlert, Info, Layers, Maximize2 } from 'lucide-react';

const ViaAdvancedCalculator = () => {
  // Inputs
  const [stubMil, setStubMil] = useState(40); 
  const [drillMil, setDrillMil] = useState(10); 
  const [padMil, setPadMil] = useState(20); 
  const [antiPadMil, setAntiPadMil] = useState(30); 
  const [thicknessMil, setThicknessMil] = useState(62);
  const [er, setEr] = useState(4.2);

  const stats = useMemo(() => {
    // 1. Resonance (Quarter-wave)
    // fres (GHz) = 11800 / (4 * stubMil * Math.sqrt(er))
    const fres = 11800 / (4 * stubMil * Math.sqrt(er));

    // 2. Inductance (L) - Standard Formula (L in nH, h and d in mils)
    // L ≈ 5.08 * h * (ln(4h/d) + 1) -> converted to mils
    // L(nH) ≈ 0.00508 * h[mil] * (Math.log(4 * h[mil] / d[mil]) + 1)
    const h = thicknessMil;
    const d = drillMil;
    const inductance = 0.00508 * h * (Math.log((4 * h) / d) + 1);

    // 3. Capacitance (C) - Standard Approximation (C in pF)
    // C ≈ (1.41 * Er * T * D1) / (D2 - D1) -> T, D1, D2 in mils
    const capacitance = (1.41 * er * thicknessMil * padMil) / (antiPadMil - padMil) / 1000; 
    // Divide by 1000 because formula usually expects inches? 
    // Let's re-verify: C (pF) = 1.41 * Er * T * D1 / (D2 - D1) where T, D1, D2 are in inches.
    // If they are in mils, the 1.41 remains the same but the result is still pF? 
    // Actually, usually it's expressed as C = 0.55 * Er * T * D1 / (D2 - D1) in pF for mils.
    // Let's use a conservative C(pF) = (0.55 * er * thicknessMil * padMil / (antiPadMil - padMil)) / 100?
    // No, standard pF = (1.41 * er * T * D1) / (D2 - D1) where dimensions are in inches.
    // Since it's a ratio D1/(D2-D1), only T matters.
    const capPf = (1.41 * er * (thicknessMil/1000) * (padMil/1000)) / ((antiPadMil - padMil)/1000);

    // 4. Characteristic Impedance of Via (Z_via)
    // Z ≈ sqrt(L/C)
    const zVia = Math.sqrt(inductance / (capPf / 1000)) || 0; // Avoid divide by zero

    let status = 'Standard';
    let statusColor = 'var(--success)';
    
    if (fres < 10 || zVia > 70 || zVia < 35) {
      status = 'High Speed Risk (Optimize Padstack)';
      statusColor = 'var(--danger)';
    } else if (fres < 25) {
      status = 'Moderate Risk';
      statusColor = 'var(--warning)';
    }

    return { fres, inductance, capPf, zVia, status, statusColor };
  }, [stubMil, drillMil, padMil, antiPadMil, thicknessMil, er]);

  return (
    <div className="si-tool-card" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-6)',
      margin: 'var(--space-6) 0',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div style={{ padding: 'var(--space-2)', background: 'rgba(212, 150, 58, 0.1)', borderRadius: 'var(--radius-md)', color: '#D4963A' }}>
          <Maximize2 size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Advanced Via Parasitic Solver</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Electromagnetic & SI Impact Analysis</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Geometry Inputs */}
        <div className="input-row" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Drill Diameter (mil)
            </label>
            <input 
              type="number" step="1" value={drillMil}
              onChange={(e) => setDrillMil(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Via Pad Diameter (mil)
            </label>
            <input 
              type="number" step="1" value={padMil}
              onChange={(e) => setPadMil(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div className="input-row" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Anti-Pad Diameter (mil)
            </label>
            <input 
              type="number" step="1" value={antiPadMil}
              onChange={(e) => setAntiPadMil(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Stub Length (mil)
            </label>
            <input 
              type="number" step="1" value={stubMil}
              onChange={(e) => setStubMil(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div className="input-row" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Board Thickness (mil)
            </label>
            <input 
              type="number" step="1" value={thicknessMil}
              onChange={(e) => setThicknessMil(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Dielectric Constant (εr)
            </label>
            <input 
              type="number" step="0.1" value={er}
              onChange={(e) => setEr(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Result Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {/* L & C Extraction */}
        <div style={{ 
          background: 'var(--bg-primary)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'var(--space-5)',
          border: '1px solid var(--border-light)',
        }}>
          <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parasitic Extraction</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Inductance (L)</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.inductance.toFixed(3)} <small style={{ fontSize: '0.7rem' }}>nH</small></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Capacitance (C)</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.capPf.toFixed(3)} <small style={{ fontSize: '0.7rem' }}>pF</small></span>
            </div>
            <div style={{ height: '1px', background: 'var(--border-light)', margin: 'var(--space-1) 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Effective Z_via</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#D4963A' }}>{stats.zVia.toFixed(1)} <small style={{ fontSize: '0.7rem' }}>Ω</small></span>
            </div>
          </div>
        </div>

        {/* Resonance & Risk */}
        <div style={{ 
          background: 'var(--bg-primary)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'var(--space-5)',
          border: `1px solid ${stats.statusColor}33`,
        }}>
          <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SI Domain Analysis</h4>
          <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: stats.statusColor, textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>{stats.status}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.fres.toFixed(1)} <small style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>GHz</small></div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Resonant Null Point (λ/4)</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-3)' }}>
        <div style={{ color: '#D4963A', marginTop: '3px' }}><ShieldAlert size={18} /></div>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          <strong>SI Impact:</strong> The via characteristic impedance (Z_via = {stats.zVia.toFixed(1)} Ω) creates a local discontinuity if not matched to your trace (typically 50 Ω). 
          For multi-Gbps channels, a mismatch &gt; 15% causes significant jitter and eye-closing reflections. Increase Anti-Pad to lower capacitance or reduce Drill to lower inductance.
        </p>
      </div>
    </div>
  );
};

export default ViaAdvancedCalculator;
