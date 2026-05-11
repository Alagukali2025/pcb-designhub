import React from 'react';

const ThermalHeatFluxVisualizer = () => {
  return (
    <div className="thermal-flux-container slide-up" style={{
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
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Heat Flux via Thermal Stitching</h4>
      
      <div className="visualizer-wrapper" style={{
        background: 'var(--bg-tertiary)',
        padding: '2rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        width: '100%',
        maxWidth: '700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <svg viewBox="0 0 500 300" width="100%" height="300" style={{ overflow: 'visible' }}>
          <defs>
            {/* Gradients for Heat Flux */}
            <linearGradient id="heat-glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.8"/>
            </linearGradient>
            
            <linearGradient id="via-heat" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8"/>
            </linearGradient>

            <linearGradient id="plane-heat-left" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2"/>
            </linearGradient>
            
            <linearGradient id="plane-heat-right" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2"/>
            </linearGradient>

            <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
              <polygon points="0,0 6,3 0,6" fill="#ef4444" />
            </marker>
            <marker id="arrow-orange" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
              <polygon points="0,0 6,3 0,6" fill="#f97316" />
            </marker>
          </defs>

          {/* Background / Dielectric */}
          <rect x="50" y="80" width="400" height="140" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
          <text x="60" y="100" fill="var(--text-tertiary)" fontSize="12">FR4 Dielectric</text>

          {/* Top Copper Layer (Thin) */}
          <rect x="50" y="75" width="400" height="5" fill="#d97706" />
          
          {/* Internal Ground Plane (Thick, Heat Spreader) */}
          <rect x="50" y="160" width="400" height="15" fill="#b45309" />
          <text x="380" y="155" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">Internal GND</text>

          {/* Bottom Copper Layer */}
          <rect x="50" y="220" width="400" height="5" fill="#d97706" />

          {/* Hot Component */}
          <rect x="200" y="40" width="100" height="35" rx="4" fill="url(#heat-glow)" stroke="#991b1b" strokeWidth="2" />
          <text x="250" y="62" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">Power IC</text>
          
          {/* Solder / Thermal Pad */}
          <rect x="210" y="75" width="80" height="5" fill="#9ca3af" />

          {/* Thermal Vias (Heat Pipes) */}
          {/* Via 1 */}
          <rect x="215" y="80" width="10" height="140" fill="url(#via-heat)" stroke="#b45309" strokeWidth="1" />
          {/* Via 2 */}
          <rect x="245" y="80" width="10" height="140" fill="url(#via-heat)" stroke="#b45309" strokeWidth="1" />
          {/* Via 3 */}
          <rect x="275" y="80" width="10" height="140" fill="url(#via-heat)" stroke="#b45309" strokeWidth="1" />

          {/* Heat Flux Indicators (Arrows) */}
          {/* Vertical Flux down the vias */}
          <line x1="220" y1="90" x2="220" y2="150" stroke="#fff" strokeWidth="2" markerEnd="url(#arrow-red)" strokeDasharray="4,2" opacity="0.8"/>
          <line x1="250" y1="90" x2="250" y2="150" stroke="#fff" strokeWidth="2" markerEnd="url(#arrow-red)" strokeDasharray="4,2" opacity="0.8"/>
          <line x1="280" y1="90" x2="280" y2="150" stroke="#fff" strokeWidth="2" markerEnd="url(#arrow-red)" strokeDasharray="4,2" opacity="0.8"/>

          {/* Horizontal Flux spreading in the Internal Plane */}
          <rect x="50" y="160" width="150" height="15" fill="url(#plane-heat-left)" opacity="0.8"/>
          <rect x="300" y="160" width="150" height="15" fill="url(#plane-heat-right)" opacity="0.8"/>

          <line x1="190" y1="167.5" x2="80" y2="167.5" stroke="#fff" strokeWidth="2" markerEnd="url(#arrow-orange)" strokeDasharray="4,2" opacity="0.8"/>
          <line x1="310" y1="167.5" x2="420" y2="167.5" stroke="#fff" strokeWidth="2" markerEnd="url(#arrow-orange)" strokeDasharray="4,2" opacity="0.8"/>

          {/* Top Layer restriction warning */}
          <path d="M 190 70 Q 150 70 150 50" fill="none" stroke="var(--danger)" strokeWidth="2" markerEnd="url(#arrow-red)" />
          <line x1="140" y1="40" x2="160" y2="60" stroke="var(--danger)" strokeWidth="2" />
          <line x1="160" y1="40" x2="140" y2="60" stroke="var(--danger)" strokeWidth="2" />
          <text x="100" y="45" fill="var(--danger)" fontSize="10" fontWeight="bold">Top Cu Bottleneck</text>

          {/* Internal Spreading Success */}
          <text x="120" y="190" fill="var(--success)" fontSize="10" fontWeight="bold">Massive Heat Spreading</text>
          <text x="380" y="190" fill="var(--success)" fontSize="10" fontWeight="bold">Massive Heat Spreading</text>
        </svg>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>
          <strong style={{ color: 'var(--text-primary)' }}>The Physics of Heat Pipes:</strong> The thin top copper layer quickly bottlenecks thermal transfer. 
          Thermal vias act as "heat pipes," driving energy vertically down into the thick internal copper planes where it can efficiently spread horizontally, 
          turning the entire PCB into a highly capable heatsink.
        </p>
      </div>
    </div>
  );
};

export default ThermalHeatFluxVisualizer;
