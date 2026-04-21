import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Zap, BookOpen, ShieldCheck, Waves, Sparkles } from 'lucide-react';
import MaterialWizard from './MaterialWizard';

const MM_TO_MIL = 39.3701;

const GLASS_STYLES = [
  { style: '1067', warp: '1067/1067', threads: '68×68', resin: 85, risk: 'Very Low', rating: 5, rec: true,
    desc: 'Tightest weave. Maximum resin content. Best for >25Gbps.' },
  { style: '1078', warp: '1078/1078', threads: '54×54', resin: 75, risk: 'Low', rating: 4, rec: true,
    desc: 'Excellent skew performance. Common for PCIe Gen5.' },
  { style: '1080', warp: '1080/1080', threads: '60×47', resin: 72, risk: 'Low', rating: 4, rec: false,
    desc: 'Good skew control. Available for DDR4/5.' },
  { style: '2116', warp: '2116/2116', threads: '60×58', resin: 52, risk: 'Medium', rating: 2, rec: false,
    desc: 'Standard prepreg. Avoid for >10Gbps pairs.' },
  { style: '7628', warp: '7628/7628', threads: '44×32', resin: 44, risk: 'High', rating: 1, rec: false,
    desc: 'Heaviest weave. Significant focal Dk variation.' },
];

const FiberWeaveSkew = () => {
  const [unitSystem, setUnitSystem] = useState('mil');
  const [activeStyle, setActiveStyle] = useState('1067');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const selected = GLASS_STYLES.find(g => g.style === activeStyle);

  const stats = useMemo(() => {
    // Heuristic skew for 5 inches of track (standard test)
    // 1067: ~2ps, 7628: ~20ps
    const baseSkew = selected.style === '1067' ? 2 : selected.style === '1078' ? 4 : selected.style === '1080' ? 6 : selected.style === '2116' ? 12 : 25;
    return { baseSkew };
  }, [activeStyle]);

  return (
    <div className="si-tool-card fade-in" id="fiber-weave-analyzer">
      <div className="si-tool-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div className="si-tool-icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Zap size={24} />
          </div>
          <div>
            <h3 className="zdiff-title">Fiber Weave Skew Solver</h3>
            <p className="zdiff-subtitle">Material-induced Dk Variation — Intra-pair Phase Skew</p>
          </div>
        </div>

        <button 
          onClick={() => setIsWizardOpen(!isWizardOpen)}
          style={{ 
            padding: '8px 16px', 
            borderRadius: 'var(--radius-md)', 
            border: 'none', 
            background: 'var(--accent-secondary)', 
            color: '#fff', 
            fontSize: '0.7rem', 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          <Sparkles size={14} /> {isWizardOpen ? 'CLOSE WIZARD' : 'STRATEGY WIZARD'}
        </button>
      </div>

      <MaterialWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onApply={(style) => setActiveStyle(style)} 
      />

      <div className="si-tool-grid">
        {/* Left Side: Weave Illustration */}
        <div className="zdiff-panel">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">Glass Bundle vs Resin Dk Map</span>
             <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                <svg viewBox="0 0 200 120" style={{ width: '100%', maxWidth: '200px' }}>
                   {/* Background Resin */}
                   <rect x="0" y="20" width="200" height="80" fill="var(--success)" fillOpacity="0.05" stroke="var(--border-light)" />
                   {/* Glass Bundles */}
                   {[40, 80, 120, 160].map(x => (
                     <rect key={x} x={x-10} y="20" width="20" height="80" fill="var(--warning)" fillOpacity="0.15" />
                   ))}
                   {/* Traces */}
                   <line x1="0" y1="45" x2="200" y2="45" stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="3" />
                   <line x1="0" y1="75" x2="200" y2="75" stroke="#06b6d4" strokeWidth="1.5" />
                   <text x="100" y="112" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">Intra-pair ΔDk ≈ 2.7 (Glass vs Resin)</text>
                </svg>
             </div>
          </div>

          <div className="zdiff-presets-box" style={{ marginTop: 'var(--space-4)' }}>
             <h5 className="zdiff-presets-title">Glass Style Selector</h5>
             <div className="fws-style-tabs" style={{ 
               display: 'grid', 
               gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', 
               gap: '4px', 
               background: 'var(--bg-primary)', 
               padding: '4px', 
               borderRadius: 'var(--radius-md)', 
               border: '1px solid var(--border-light)' 
             }}>
                {GLASS_STYLES.map(g => (
                  <button 
                    key={g.style} 
                    className={`text-[10px] py-2 rounded font-black transition-colors ${activeStyle === g.style ? 'bg-accent-secondary text-white' : 'text-tertiary hover:bg-white/5'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                    onClick={() => setActiveStyle(g.style)}
                  >
                    {g.style}
                  </button>
                ))}
             </div>
          </div>

          <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginTop: 'var(--space-4)' }}>
             <p className="section-text" style={{ fontSize: '0.7rem', fontStyle: 'italic', margin: 0 }}>
               "Traces over glass bundles (Dk ~6.0) are slower than traces over resin-rich zones (Dk ~3.2). This creates deterministic jitter."
             </p>
          </div>
        </div>

        {/* Right Side: Analytical Results */}
        <div className="zdiff-panel">
          <div className="zdiff-result-card" style={{ borderColor: selected.rating < 3 ? 'var(--danger)' : 'var(--success)' }}>
            <div className="zdiff-result-label">Intra-pair Skew Profile</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: selected.rating < 3 ? 'var(--danger)' : 'var(--success)' }}>
                {selected.risk}
              </span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">HS Rating</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--success)' }}>{'★'.repeat(selected.rating)}</div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Resin %</div>
                <div className="zdiff-result-sub-val">{selected.resin}%</div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Skew / 5in</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--warning)' }}>~{stats.baseSkew} ps</div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Warp/Fill</div>
                <div className="zdiff-result-sub-val">{selected.warp}</div>
              </div>
            </div>

            {/* Verdict */}
            <div className={`zdiff-verdict ${selected.rating < 3 ? 'zdiff-verdict--danger' : 'zdiff-verdict--ok'}`}>
              <div className="zdiff-verdict-icon">{selected.rating < 3 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}</div>
              <div>
                <p className="zdiff-verdict-title">SI Domain Verdict</p>
                <p className="zdiff-verdict-body">{selected.desc}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
             <h5 style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#818cf8', marginBottom: 'var(--space-1)' }}>Mitigation Strategy</h5>
             <ul className="body-list" style={{ margin: 0, paddingLeft: 'var(--space-4)', listStyle: 'disc', fontSize: '0.7rem' }}>
                <li>Rotate PCB layout by <strong>10° relative to glass weave</strong>.</li>
                <li>Use <strong>spread-glass</strong> fabrics (1067/1078).</li>
                <li>Zig-zag route tracks across glass bundles.</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiberWeaveSkew;
