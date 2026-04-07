import React, { useState, useMemo } from 'react';
import { Ruler, Zap, Info, ShieldAlert, Layers, Thermometer } from 'lucide-react';

const IPC2152Calculator = () => {
  const [current, setCurrent] = useState(5);
  const [tempRise, setTempRise] = useState(10);
  const [copperWeight, setCopperWeight] = useState(1); // oz
  const [isInternal, setIsInternal] = useState(true);

  const stats = useMemo(() => {
    // k, b, c for IPC-2152 (Unified approximation)
    // Internal: k=0.024, b=0.44, c=0.725
    // External: k=0.048, b=0.44, c=0.725
    const k = isInternal ? 0.024 : 0.048;
    const b = 0.44;
    const c = 0.725;

    // A = (I / (k * dT^b))^(1/c) in sq mils
    const crossSectionArea = Math.pow(current / (k * Math.pow(tempRise, b)), 1/c);
    
    // Copper thickness in mils (1oz = 1.37mil)
    const thickness = copperWeight * 1.37;
    
    // Width (mil) = Area / Thickness
    const widthMil = crossSectionArea / thickness;
    const widthMm = widthMil * 0.0254;

    return { crossSectionArea, thickness, widthMil, widthMm };
  }, [current, tempRise, copperWeight, isInternal]);

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
        <div style={{ padding: 'var(--space-2)', background: 'rgba(55, 138, 221, 0.1)', borderRadius: 'var(--radius-md)', color: '#378ADD' }}>
          <Zap size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>IPC-2152 Trace Capacity Solver</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Current Carrying & Trace Width Optimization</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="input-row" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Target Current (Amps)
            </label>
            <input 
              type="number" step="0.5" value={current}
              onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Allowable Temp Rise (°C)
            </label>
            <input 
              type="number" step="1" value={tempRise}
              onChange={(e) => setTempRise(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div className="input-row" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Copper Weight (oz)
            </label>
            <select 
              value={copperWeight}
              onChange={(e) => setCopperWeight(parseFloat(e.target.value))}
              style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
            >
              <option value={0.5}>0.5 oz (Plated/Thin)</option>
              <option value={1}>1.0 oz (Standard)</option>
              <option value={2}>2.0 oz (Power/Heavy)</option>
              <option value={3}>3.0 oz (Extreme Power)</option>
            </select>
          </div>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Routing Layer
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={() => setIsInternal(true)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--border-light)', background: isInternal ? 'var(--accent-primary)' : 'var(--bg-primary)', color: isInternal ? 'white' : 'var(--text-tertiary)' }}
              >Internal</button>
              <button 
                onClick={() => setIsInternal(false)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--border-light)', background: !isInternal ? 'var(--accent-primary)' : 'var(--bg-primary)', color: !isInternal ? 'white' : 'var(--text-tertiary)' }}
              >External</button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--space-6)',
        border: '1px solid var(--border-light)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 'var(--space-4)', letterSpacing: '0.1em' }}>Recommended Trace Width</div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '12px' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.widthMil.toFixed(1)}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>mils</div>
        </div>
        
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-secondary)', marginTop: '8px' }}>({stats.widthMm.toFixed(3)} mm)</div>

        <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-3)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Cross Section</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{stats.crossSectionArea.toFixed(1)} <span style={{ fontSize: '0.7rem' }}>sq mils</span></div>
          </div>
          <div style={{ padding: 'var(--space-3)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Copper Thickness</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{stats.thickness.toFixed(2)} <span style={{ fontSize: '0.7rem' }}>mils</span></div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'rgba(255, 138, 0, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 138, 0, 0.2)', display: 'flex', gap: 'var(--space-3)' }}>
        <div style={{ color: '#FF8A00' }}><ShieldAlert size={18} /></div>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          <strong>IPC-2152 Compliance:</strong> Internal traces (stripline) require more width than external traces for the same temperature rise as they cannot dissipate heat to the surrounding air. Always include a 10-20% margin for etching variations.
        </p>
      </div>
    </div>
  );
};

export default IPC2152Calculator;
