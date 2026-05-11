import React from 'react';

const ReturnPathVisualizer = () => {
  return (
    <div className="return-path-container slide-up" style={{
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
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>High-Frequency Return Path Physics</h4>
      
      <div className="visualizer-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '800px'
      }}>
        
        {/* Continuous Plane Panel (Ideal) */}
        <div className="ideal-panel" style={{
          background: 'var(--bg-tertiary)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <h5 style={{ color: '#10b981', margin: 0 }}>Continuous Reference Plane</h5>
          <svg viewBox="0 0 250 200" width="100%" height="200" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="#10b981" />
              </marker>
              <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="#3b82f6" />
              </marker>
            </defs>

            {/* Solid Ground Plane */}
            <rect x="20" y="40" width="210" height="120" rx="4" fill="#f59e0b" opacity="0.8" />
            <text x="30" y="150" fill="#fff" fontSize="10" fontWeight="bold">Solid GND Plane</text>

            {/* Signal Trace */}
            <path d="M 40 100 L 210 100" fill="none" stroke="#3b82f6" strokeWidth="4" />
            
            {/* Forward Current Arrow */}
            <line x1="60" y1="90" x2="90" y2="90" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />
            <text x="50" y="80" fill="#3b82f6" fontSize="9" fontWeight="bold">Forward Signal</text>

            {/* Return Path (Mirrors trace) */}
            <path d="M 210 100 L 40 100" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="6,4" opacity="0.8" />
            
            {/* Return Current Arrow */}
            <line x1="190" y1="110" x2="160" y2="110" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-green)" />
            <text x="145" y="125" fill="#10b981" fontSize="9" fontWeight="bold">Return Current</text>

            {/* Loop Area Highlight */}
            <ellipse cx="125" cy="100" rx="80" ry="15" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>
            Current perfectly mirrors the trace to minimize inductance. <strong>Microscopic Loop Area = Zero EMI.</strong>
          </p>
        </div>

        {/* Split Plane Panel (Disaster) */}
        <div className="disaster-panel" style={{
          background: 'var(--bg-tertiary)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--danger)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.1)'
        }}>
          <h5 style={{ color: 'var(--danger)', margin: 0 }}>The "Split Plane" Disaster</h5>
          <svg viewBox="0 0 250 200" width="100%" height="200" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="var(--danger)" />
              </marker>
              <pattern id="radiation" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(239, 68, 68, 0.4)" />
              </pattern>
            </defs>

            {/* Split Ground Planes */}
            <rect x="20" y="40" width="90" height="120" rx="4" fill="#f59e0b" opacity="0.8" />
            <rect x="140" y="40" width="90" height="120" rx="4" fill="#f59e0b" opacity="0.8" />
            
            {/* The Gap */}
            <text x="110" y="155" fill="var(--danger)" fontSize="9" fontWeight="bold">GAP</text>
            <line x1="115" y1="40" x2="115" y2="140" stroke="var(--danger)" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="135" y1="40" x2="135" y2="140" stroke="var(--danger)" strokeWidth="1" strokeDasharray="4,4" />

            {/* Signal Trace */}
            <path d="M 40 100 L 210 100" fill="none" stroke="#3b82f6" strokeWidth="4" />
            
            {/* Forward Current Arrow */}
            <line x1="60" y1="90" x2="90" y2="90" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />

            {/* Detoured Return Path (The Disaster) */}
            {/* Detour around the gap via top edge connection */}
            <path d="M 210 100 L 160 100 Q 140 100 140 50 L 110 50 Q 110 100 90 100 L 40 100" fill="none" stroke="var(--danger)" strokeWidth="4" strokeDasharray="4,4" />
            
            {/* Return Current Arrow Detour */}
            <line x1="145" y1="75" x2="130" y2="55" stroke="var(--danger)" strokeWidth="2" markerEnd="url(#arrow-red)" />
            <line x1="118" y1="55" x2="105" y2="75" stroke="var(--danger)" strokeWidth="2" markerEnd="url(#arrow-red)" />
            
            {/* Massive Loop Area Radiation */}
            <path d="M 160 100 Q 140 100 140 50 L 110 50 Q 110 100 90 100 L 160 100" fill="url(#radiation)" stroke="none" />
            <text x="125" y="80" fill="var(--danger)" fontSize="10" fontWeight="bold" textAnchor="middle">EMI!</text>
            
            {/* Radiation Waves */}
            <path d="M 125 40 Q 140 20 160 30" fill="none" stroke="var(--danger)" strokeWidth="1" opacity="0.6" />
            <path d="M 125 30 Q 150 0 175 15" fill="none" stroke="var(--danger)" strokeWidth="1" opacity="0.4" />

          </svg>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>
            Current is forced to detour around the gap. <strong>Massive Loop Area = Violent EMI & Crosstalk.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPathVisualizer;
