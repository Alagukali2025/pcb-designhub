import React from 'react';

const FlybyTopologyVisualizer = () => {
  return (
    <div className="flyby-container slide-up" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem'
    }}>
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>DDR Routing: T-Branch vs. Fly-By Topology</h4>
      
      <div className="visualizer-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '850px'
      }}>
        
        {/* Panel 1: Legacy T-Branch */}
        <div className="legacy-panel" style={{
          background: 'var(--bg-tertiary)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--danger)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.05)'
        }}>
          <h5 style={{ color: 'var(--danger)', margin: 0 }}>Legacy T-Branch (DDR2/DDR3)</h5>
          <svg viewBox="0 0 300 200" width="100%" height="200" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="var(--danger)" />
              </marker>
              <linearGradient id="reflection-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.6)"/>
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)"/>
              </linearGradient>
            </defs>

            {/* Controller */}
            <rect x="20" y="80" width="60" height="40" rx="4" fill="#3b82f6" />
            <text x="50" y="104" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">CTRL</text>

            {/* DRAM 1 & 2 */}
            <rect x="220" y="30" width="60" height="40" rx="4" fill="#10b981" />
            <text x="250" y="54" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">DRAM 1</text>
            
            <rect x="220" y="130" width="60" height="40" rx="4" fill="#10b981" />
            <text x="250" y="154" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">DRAM 2</text>

            {/* Signal Traces */}
            {/* Trunk */}
            <path d="M 80 100 L 150 100" fill="none" stroke="var(--text-secondary)" strokeWidth="3" />
            {/* Branch 1 */}
            <path d="M 150 100 L 150 50 L 220 50" fill="none" stroke="var(--text-secondary)" strokeWidth="3" />
            {/* Branch 2 */}
            <path d="M 150 100 L 150 150 L 220 150" fill="none" stroke="var(--text-secondary)" strokeWidth="3" />

            {/* Impedance Mismatch at T-Junction */}
            <circle cx="150" cy="100" r="15" fill="url(#reflection-glow)" stroke="var(--danger)" strokeWidth="1" strokeDasharray="2,2" />
            <text x="150" y="125" fill="var(--danger)" fontSize="9" fontWeight="bold" textAnchor="middle">Z₀ Mismatch!</text>

            {/* Reflection Arrows */}
            <line x1="145" y1="95" x2="110" y2="95" stroke="var(--danger)" strokeWidth="1.5" markerEnd="url(#arrow-red)" strokeDasharray="4,2" />
            <line x1="145" y1="105" x2="110" y2="105" stroke="var(--danger)" strokeWidth="1.5" markerEnd="url(#arrow-red)" strokeDasharray="4,2" />
            <text x="100" y="85" fill="var(--danger)" fontSize="8" fontWeight="bold">Reflections</text>

            {/* Arrival Time */}
            <text x="250" y="25" fill="var(--success)" fontSize="9" fontWeight="bold" textAnchor="middle">t = 0 (Simultaneous)</text>
            <text x="250" y="185" fill="var(--success)" fontSize="9" fontWeight="bold" textAnchor="middle">t = 0 (Simultaneous)</text>
            
          </svg>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>
            Signals split symmetrically to hit all DRAMs at exactly the same time. The branch point causes an unavoidable impedance mismatch. <strong>Fails at DDR4 speeds.</strong>
          </p>
        </div>

        {/* Panel 2: Modern Fly-By */}
        <div className="flyby-panel" style={{
          background: 'var(--bg-tertiary)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--success)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.05)'
        }}>
          <h5 style={{ color: 'var(--success)', margin: 0 }}>Modern Fly-By (DDR4/DDR5)</h5>
          <svg viewBox="0 0 300 200" width="100%" height="200" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="var(--success)" />
              </marker>
            </defs>

            {/* Controller */}
            <rect x="10" y="130" width="50" height="30" rx="4" fill="#3b82f6" />
            <text x="35" y="149" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">CTRL</text>

            {/* DRAM 1, 2, 3 */}
            <rect x="80" y="40" width="40" height="30" rx="4" fill="#10b981" />
            <text x="100" y="59" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">DR1</text>
            
            <rect x="150" y="40" width="40" height="30" rx="4" fill="#10b981" />
            <text x="170" y="59" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">DR2</text>
            
            <rect x="220" y="40" width="40" height="30" rx="4" fill="#10b981" />
            <text x="240" y="59" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">DR3</text>

            {/* Termination VTT */}
            <rect x="270" y="125" width="20" height="15" rx="2" fill="#f59e0b" />
            <text x="280" y="136" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">VTT</text>
            <rect x="270" y="140" width="20" height="5" fill="#ef4444" /> {/* Ground/Termination symbol */}

            {/* Continuous Signal Trace (Daisy Chain) */}
            <path d="M 60 145 L 80 145 L 100 110 L 100 70 M 100 110 L 170 110 L 170 70 M 170 110 L 240 110 L 240 70 M 240 110 L 280 110 L 280 125" fill="none" stroke="var(--success)" strokeWidth="3" />

            {/* Signal Flow Arrow */}
            <line x1="70" y1="145" x2="80" y2="145" stroke="var(--success)" strokeWidth="2" markerEnd="url(#arrow-green)" />
            <line x1="120" y1="110" x2="140" y2="110" stroke="var(--success)" strokeWidth="2" markerEnd="url(#arrow-green)" />
            <line x1="190" y1="110" x2="210" y2="110" stroke="var(--success)" strokeWidth="2" markerEnd="url(#arrow-green)" />
            <line x1="250" y1="110" x2="265" y2="110" stroke="var(--success)" strokeWidth="2" markerEnd="url(#arrow-green)" />

            {/* Intentional Skew Labels */}
            <text x="100" y="30" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">t = 0</text>
            <text x="170" y="30" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">t = 1</text>
            <text x="240" y="30" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">t = 2</text>
            
            <text x="170" y="15" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Intentional Skew</text>
            <path d="M 120 25 L 220 25" fill="none" stroke="var(--text-secondary)" strokeWidth="1" strokeDasharray="2,2" />

            <text x="170" y="170" fill="var(--success)" fontSize="10" fontWeight="bold" textAnchor="middle">Zero Reflections</text>
            <text x="170" y="185" fill="var(--success)" fontSize="8" textAnchor="middle">(Corrected by Write Leveling)</text>

          </svg>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>
            Signals pass continuously through each DRAM in sequence. Zero impedance splits. <strong>The sequential delay is corrected by the CPU.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlybyTopologyVisualizer;
