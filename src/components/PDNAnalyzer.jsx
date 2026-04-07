import React, { useState, useMemo } from 'react';
import { ShieldCheck, Zap, Info, TrendingDown, LayoutPanelLeft } from 'lucide-react';

const PDNAnalyzer = () => {
  const [voltage, setVoltage] = useState(1.1); 
  const [ripple, setRipple] = useState(5);   
  const [current, setCurrent] = useState(10); 
  const [bandwidth, setBandwidth] = useState(100); // 100 MHz typical transient BW

  const stats = useMemo(() => {
    const vRipple = voltage * (ripple / 100);
    const zTarget = (vRipple / current) * 1000; // in mΩ

    // Cap strategy derivation (Simplified professional heuristic)
    // Needs C = 1 / (2 * pi * f * Ztarget)
    // Total C for 10MHz support:
    const totalC_uF = (1 / (2 * Math.PI * 1e7 * (zTarget / 1000))) * 1e6;

    let status = 'Standard';
    let statusColor = 'var(--success)';
    
    if (zTarget < 10) {
      status = 'Extreme High Performance (DDR5/GPU Core)';
      statusColor = 'var(--danger)';
    } else if (zTarget < 30) {
      status = 'Advanced (High Speed FPGA/ASIC)';
      statusColor = 'var(--warning)';
    }

    // Recommended Cap Stack
    const recommendations = [
      { type: 'Bulk', range: '100uF - 470uF', qty: zTarget < 15 ? 2 : 1, note: 'Low-ESR Tantalum/Polymer' },
      { type: 'High-Freq', range: '0.1uF / 0402', qty: Math.ceil(50 / (zTarget / 10)), note: 'Low-ESL Ceramic (X7R/X5R)' },
      { type: 'Ultra-High', range: '10nF / 0201', qty: Math.ceil(20 / (zTarget / 10)), note: 'Interposed/Under-BGA mounting' },
    ];

    return { vRipple, zTarget, totalC_uF, recommendations, status, statusColor };
  }, [voltage, ripple, current]);

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
          <TrendingDown size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Advanced PDN Impedance & Decoupling Analyzer</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Power Stability & Noise Containment Strategy</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Rail Voltage (V)
          </label>
          <input 
            type="number" step="0.1" value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Max Ripple (%)
          </label>
          <input 
            type="number" step="1" value={ripple}
            onChange={(e) => setRipple(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Transient Current (A)
          </label>
          <input 
            type="number" step="1" value={current}
            onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Target Z Result */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--space-6)',
        border: `1px solid ${stats.statusColor}33`,
        marginBottom: 'var(--space-6)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.zTarget.toFixed(1)} <small style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>mΩ</small></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>Calculated Target Impedance (Z_target)</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: stats.statusColor, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>{stats.status}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', marginTop: '6px', display: 'inline-block' }}>Limit up to 5th Harmonic</span>
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ color: '#378ADD' }}><Zap size={16} /></div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            To maintain rail stability, the PDN loop impedance from the VRM to the IC load must remain below <strong>{stats.zTarget.toFixed(1)} mΩ</strong>. Total bulk capacitance required to handle transient step: <strong>{stats.totalC_uF.toFixed(0)} µF</strong>.
          </p>
        </div>
      </div>

      {/* Decoupling Strategy Section */}
      <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LayoutPanelLeft size={18} className="text-accent-secondary" />
        Decoupling Capacitor Placement Strategy
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        {stats.recommendations.map((rec, i) => (
          <div key={i} style={{ 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--space-4)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{rec.type}</span>
              <span style={{ fontSize: '0.7rem', background: 'var(--accent-secondary)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>QTY: {rec.qty}</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{rec.range}</div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{rec.note}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'rgba(55, 138, 221, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(55, 138, 221, 0.2)' }}>
        <h5 style={{ margin: '0 0 var(--space-2) 0', fontSize: '0.8rem', color: '#378ADD', textTransform: 'uppercase' }}>Placement Engineering Rules</h5>
        <ul style={{ margin: 0, padding: '0 0 0 1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <li>Minimize <strong>Loop Inductance</strong> by placing vias immediately adjacent to capacitor pads.</li>
          <li>For high-speed rails, use <strong>Via-in-Pad</strong> to reduce path ESL by &gt;200pH.</li>
          <li>Mount HF caps on the bottom side directly under the IC power pins.</li>
        </ul>
      </div>
    </div>
  );
};

export default PDNAnalyzer;
