import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function BendRadiusCalculator() {
  const [thicknessMil, setThicknessMil] = useState(4);
  const [thicknessMm, setThicknessMm] = useState(0.10);
  const [appType, setAppType] = useState('dynamic'); // static, dynamic

  const updateMil = (val) => {
    setThicknessMil(val);
    setThicknessMm((val * 0.0254).toFixed(3));
  };

  const updateMm = (val) => {
    setThicknessMm(val);
    setThicknessMil((val / 0.0254).toFixed(1));
  };

  const multiplier = appType === 'dynamic' ? 10 : 6;
  const radiusMil = (thicknessMil * multiplier).toFixed(1);
  const radiusMm = (thicknessMm * multiplier).toFixed(3);

  return (
    <div className="calculator-panel slide-up" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem'
    }}>
      <div className="calculator-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
          <Calculator size={24} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Minimum Bend Radius Calculator</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>IPC-2223D ENGINEERING PROTOCOL</span>
        </div>
      </div>

      <div className="calc-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Application Type */}
          <div className="input-group full-width">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Application Type</label>
            <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: appType === 'static' ? 'var(--bg-secondary)' : 'transparent', border: appType === 'static' ? '1px solid var(--accent-primary)' : '1px solid transparent', borderRadius: 'var(--radius-sm)' }}>
                <input 
                  type="radio" 
                  name="appType" 
                  value="static" 
                  checked={appType === 'static'} 
                  onChange={(e) => setAppType(e.target.value)} 
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Static (6x)</span>
              </label>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: appType === 'dynamic' ? 'var(--bg-secondary)' : 'transparent', border: appType === 'dynamic' ? '1px solid var(--accent-primary)' : '1px solid transparent', borderRadius: 'var(--radius-sm)' }}>
                <input 
                  type="radio" 
                  name="appType" 
                  value="dynamic" 
                  checked={appType === 'dynamic'} 
                  onChange={(e) => setAppType(e.target.value)} 
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Dynamic (10x)</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Flex Thickness (mil) */}
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Flex Thickness (mil)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  step="0.1"
                  value={thicknessMil} 
                  onChange={(e) => updateMil(parseFloat(e.target.value) || 0)} 
                  style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                />
                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>mil</span>
              </div>
            </div>
            
            {/* Flex Thickness (mm) */}
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Flex Thickness (mm)</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  step="0.01"
                  value={thicknessMm} 
                  onChange={(e) => updateMm(parseFloat(e.target.value) || 0)} 
                  style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                />
                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="results-panel" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <h4 style={{ margin: 0, marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minimum Bend Radius</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--accent-primary)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{radiusMil}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>mils</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{radiusMm}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>mm</div>
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent-primary)' }}>💡</span>
            <span>
              {appType === 'static' ? 
                "Rule: 6 × Total Flex Thickness. Use for flex circuits that are bent once for installation." : 
                "Rule: 10 × Total Flex Thickness. Mandatory for flex circuits that bend continuously during operation. Use ONLY Rolled Annealed (RA) copper."
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
