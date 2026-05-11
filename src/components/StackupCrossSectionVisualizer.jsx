import React from 'react';

const StackupCrossSectionVisualizer = () => {
  return (
    <div className="stackup-visualizer-container slide-up" style={{
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
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Microstrip vs. Stripline Physical Geometry</h4>
      
      <div className="visualizer-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '800px'
      }}>
        
        {/* Microstrip Panel */}
        <div className="microstrip-panel" style={{
          background: 'var(--bg-tertiary)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <h5 style={{ color: '#3b82f6', margin: 0 }}>Microstrip (Surface Layer)</h5>
          <svg viewBox="0 0 250 150" width="100%" height="150" style={{ overflow: 'visible' }}>
            {/* Air Area */}
            <rect x="0" y="0" width="250" height="50" fill="transparent" />
            <text x="10" y="20" fill="var(--text-tertiary)" fontSize="10">Air (Er = 1.0)</text>
            
            {/* Dielectric Substrate */}
            <rect x="0" y="50" width="250" height="70" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
            <text x="10" y="90" fill="var(--text-tertiary)" fontSize="10">Dielectric (Er)</text>
            
            {/* Ground Plane */}
            <rect x="0" y="120" width="250" height="15" fill="#f59e0b" />
            <text x="210" y="131" fill="#fff" fontSize="10" fontWeight="bold">GND</text>
            
            {/* Signal Trace */}
            <rect x="100" y="40" width="50" height="10" fill="#3b82f6" />
            <text x="125" y="35" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">Signal</text>
            
            {/* W Dimension */}
            <line x1="100" y1="20" x2="150" y2="20" stroke="var(--text-primary)" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x="125" y="15" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">W</text>
            
            {/* H Dimension */}
            <line x1="180" y1="50" x2="180" y2="120" stroke="var(--text-primary)" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x="185" y="90" fill="var(--text-primary)" fontSize="10" fontWeight="bold">H</text>
            
            {/* Field Lines representation (arcs) */}
            <path d="M 100 50 Q 80 85 80 120" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 125 50 Q 125 85 125 120" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 150 50 Q 170 85 170 120" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            
            {/* Radiating field into air */}
            <path d="M 100 40 Q 80 10 50 10" fill="none" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 150 40 Q 170 10 200 10" fill="none" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>
            Fields travel partially in air and partially in dielectric (effective Er). Faster propagation, but prone to EMI radiation.
          </p>
        </div>

        {/* Stripline Panel */}
        <div className="stripline-panel" style={{
          background: 'var(--bg-tertiary)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <h5 style={{ color: '#10b981', margin: 0 }}>Stripline (Internal Layer)</h5>
          <svg viewBox="0 0 250 150" width="100%" height="150" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="var(--text-primary)" />
              </marker>
            </defs>
            
            {/* Top Ground Plane */}
            <rect x="0" y="10" width="250" height="15" fill="#f59e0b" />
            <text x="210" y="21" fill="#fff" fontSize="10" fontWeight="bold">GND</text>
            
            {/* Dielectric Substrate */}
            <rect x="0" y="25" width="250" height="95" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
            <text x="10" y="75" fill="var(--text-tertiary)" fontSize="10">Dielectric (Er)</text>
            
            {/* Bottom Ground Plane */}
            <rect x="0" y="120" width="250" height="15" fill="#f59e0b" />
            <text x="210" y="131" fill="#fff" fontSize="10" fontWeight="bold">GND</text>
            
            {/* Signal Trace */}
            <rect x="100" y="67.5" width="50" height="10" fill="#10b981" />
            <text x="155" y="76" fill="#10b981" fontSize="10" fontWeight="bold">Signal</text>
            
            {/* W Dimension */}
            <line x1="100" y1="55" x2="150" y2="55" stroke="var(--text-primary)" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x="125" y="50" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">W</text>
            
            {/* H1 Dimension */}
            <line x1="180" y1="25" x2="180" y2="67.5" stroke="var(--text-primary)" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x="185" y="50" fill="var(--text-primary)" fontSize="10" fontWeight="bold">H1</text>
            
            {/* H2 Dimension */}
            <line x1="180" y1="77.5" x2="180" y2="120" stroke="var(--text-primary)" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x="185" y="100" fill="var(--text-primary)" fontSize="10" fontWeight="bold">H2</text>
            
            {/* Field Lines representation (arcs) */}
            {/* Upwards */}
            <path d="M 100 67.5 Q 80 46 80 25" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 125 67.5 Q 125 46 125 25" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 150 67.5 Q 170 46 170 25" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            
            {/* Downwards */}
            <path d="M 100 77.5 Q 80 98 80 120" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 125 77.5 Q 125 98 125 120" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 150 77.5 Q 170 98 170 120" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
            
          </svg>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>
            Fields are 100% contained within the dielectric. Zero EMI radiation, excellent return path isolation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StackupCrossSectionVisualizer;
