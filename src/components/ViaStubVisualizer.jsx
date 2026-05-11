import React from 'react';

const ViaStubVisualizer = () => {
  return (
    <div className="via-stub-container slide-up" style={{
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
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Via Stub Resonance vs. Back-Drilling</h4>
      
      <div className="visualizer-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '850px'
      }}>
        
        {/* Panel 1: The Stub Problem */}
        <div className="stub-panel" style={{
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
          <h5 style={{ color: 'var(--danger)', margin: 0 }}>Standard Via (The Problem)</h5>
          <svg viewBox="0 0 250 220" width="100%" height="220" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="#3b82f6" />
              </marker>
              <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="var(--danger)" />
              </marker>
              <linearGradient id="stub-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.2)"/>
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0.9)"/>
              </linearGradient>
            </defs>

            {/* PCB Cross Section Background */}
            <rect x="40" y="20" width="180" height="180" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
            
            {/* Layer Lines and Labels */}
            <line x1="40" y1="20" x2="220" y2="20" stroke="var(--border-color)" strokeWidth="2" />
            <text x="10" y="24" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">L1</text>
            
            <line x1="40" y1="80" x2="220" y2="80" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="2,2" />
            <text x="10" y="84" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">L3</text>
            
            <line x1="40" y1="200" x2="220" y2="200" stroke="var(--border-color)" strokeWidth="2" />
            <text x="10" y="204" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">L8</text>

            {/* The Via Barrel */}
            <rect x="120" y="20" width="20" height="180" fill="#d97706" />

            {/* The Unused Stub Glow */}
            <rect x="120" y="80" width="20" height="120" fill="url(#stub-glow)" />

            {/* Signal Trace In (L1) */}
            <path d="M 40 20 L 120 20" fill="none" stroke="#3b82f6" strokeWidth="4" />
            
            {/* Signal Trace Out (L3) */}
            <path d="M 140 80 L 220 80" fill="none" stroke="#3b82f6" strokeWidth="4" />
            
            {/* Primary Signal Flow Arrows */}
            <line x1="60" y1="10" x2="90" y2="10" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />
            <line x1="160" y1="70" x2="190" y2="70" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />
            <text x="60" y="8" fill="#3b82f6" fontSize="9" fontWeight="bold">Tx</text>
            <text x="195" y="68" fill="#3b82f6" fontSize="9" fontWeight="bold">Rx</text>

            {/* Stub Reflection Arrows */}
            <line x1="125" y1="90" x2="125" y2="180" stroke="#fff" strokeWidth="1.5" markerEnd="url(#arrow-red)" strokeDasharray="3,2" />
            <line x1="135" y1="180" x2="135" y2="90" stroke="#fff" strokeWidth="1.5" markerEnd="url(#arrow-red)" strokeDasharray="3,2" />
            
            <text x="150" y="145" fill="var(--danger)" fontSize="9" fontWeight="bold">λ/4 Resonance</text>
            <text x="150" y="160" fill="var(--danger)" fontSize="9" fontWeight="bold">(Signal Absorption)</text>

            {/* The Stub Bracket */}
            <path d="M 110 80 L 100 80 L 100 200 L 110 200" fill="none" stroke="var(--danger)" strokeWidth="1" />
            <text x="50" y="145" fill="var(--danger)" fontSize="10" fontWeight="bold">Dead Stub</text>

          </svg>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>
            High-frequency energy travels down the unused stub, reflects off the dead end, and collides with the primary signal.
          </p>
        </div>

        {/* Panel 2: Back-Drilled (The Solution) */}
        <div className="drilled-panel" style={{
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
          <h5 style={{ color: 'var(--success)', margin: 0 }}>Back-Drilled Via (The Solution)</h5>
          <svg viewBox="0 0 250 220" width="100%" height="220" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                <polygon points="0,0 6,3 0,6" fill="var(--success)" />
              </marker>
            </defs>

            {/* PCB Cross Section Background */}
            <rect x="40" y="20" width="180" height="180" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="1" />
            
            {/* Layer Lines and Labels */}
            <line x1="40" y1="20" x2="220" y2="20" stroke="var(--border-color)" strokeWidth="2" />
            <text x="10" y="24" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">L1</text>
            
            <line x1="40" y1="80" x2="220" y2="80" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="2,2" />
            <text x="10" y="84" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">L3</text>
            
            <line x1="40" y1="200" x2="220" y2="200" stroke="var(--border-color)" strokeWidth="2" />
            <text x="10" y="204" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">L8</text>

            {/* The Via Barrel (Only L1 to just past L3) */}
            <rect x="120" y="20" width="20" height="70" fill="#d97706" />

            {/* The Drilled Out Area */}
            <rect x="115" y="90" width="30" height="110" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="2,2" />
            <text x="120" y="150" fill="var(--text-tertiary)" fontSize="9" fontWeight="bold" transform="rotate(-90 125,150)">AIR / EPOXY</text>

            {/* Signal Trace In (L1) */}
            <path d="M 40 20 L 120 20" fill="none" stroke="var(--success)" strokeWidth="4" />
            
            {/* Signal Trace Out (L3) */}
            <path d="M 140 80 L 220 80" fill="none" stroke="var(--success)" strokeWidth="4" />
            
            {/* Primary Signal Flow Arrows */}
            <line x1="60" y1="10" x2="90" y2="10" stroke="var(--success)" strokeWidth="2" markerEnd="url(#arrow-green)" />
            <line x1="160" y1="70" x2="190" y2="70" stroke="var(--success)" strokeWidth="2" markerEnd="url(#arrow-green)" />
            <text x="60" y="8" fill="var(--success)" fontSize="9" fontWeight="bold">Tx</text>
            <text x="195" y="68" fill="var(--success)" fontSize="9" fontWeight="bold">Rx</text>

            {/* Back-Drill Depth Dimension */}
            <line x1="160" y1="90" x2="175" y2="90" stroke="var(--text-primary)" strokeWidth="1" />
            <line x1="160" y1="200" x2="175" y2="200" stroke="var(--text-primary)" strokeWidth="1" />
            
            <line x1="167.5" y1="90" x2="167.5" y2="200" stroke="var(--text-primary)" strokeWidth="1" markerStart="url(#arrow-green)" markerEnd="url(#arrow-green)" />
            <text x="175" y="150" fill="var(--text-primary)" fontSize="9" fontWeight="bold">Back-Drill Depth</text>

            {/* Safe Residual Stub Bracket */}
            <path d="M 110 80 L 100 80 L 100 90 L 110 90" fill="none" stroke="var(--success)" strokeWidth="1" />
            <text x="35" y="88" fill="var(--success)" fontSize="9" fontWeight="bold">Residual (Safe)</text>

          </svg>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, lineHeight: '1.4' }}>
            The unused copper is physically drilled out from the bottom. Resonance is eliminated, allowing clean data transmission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViaStubVisualizer;
