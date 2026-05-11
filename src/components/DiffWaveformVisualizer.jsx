import React from 'react';

const DiffWaveformVisualizer = () => {
  return (
    <div className="diff-waveform-container slide-up" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Differential Signaling Phase Alignment</h4>
      <div className="waveform-svg-wrapper" style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
        <svg viewBox="0 0 500 200" width="100%" height="100%">
          {/* Grid lines */}
          <line x1="0" y1="100" x2="500" y2="100" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="50" y1="0" x2="50" y2="200" stroke="var(--border-color)" strokeWidth="1" />
          
          {/* Axis Labels */}
          <text x="10" y="104" fill="var(--text-secondary)" fontSize="12" fontFamily="sans-serif">0V</text>
          <text x="40" y="15" fill="var(--text-secondary)" fontSize="12" fontFamily="sans-serif">V</text>
          <text x="480" y="115" fill="var(--text-secondary)" fontSize="12" fontFamily="sans-serif">t</text>

          {/* D+ Waveform (Blue) */}
          <path d="M 50 100 Q 100 20, 150 100 T 250 100 T 350 100 T 450 100" fill="none" stroke="#3b82f6" strokeWidth="3" />
          
          {/* D- Waveform (Orange) */}
          <path d="M 50 100 Q 100 180, 150 100 T 250 100 T 350 100 T 450 100" fill="none" stroke="#f97316" strokeWidth="3" />

          {/* Vdiff Indication */}
          <line x1="200" y1="20" x2="200" y2="180" stroke="var(--text-tertiary)" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M 195 25 L 200 20 L 205 25" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" />
          <path d="M 195 175 L 200 180 L 205 175" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" />
          
          {/* Labels */}
          <rect x="260" y="30" width="40" height="20" rx="4" fill="var(--bg-primary)" stroke="#3b82f6" strokeWidth="1"/>
          <text x="280" y="44" fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">D+</text>
          
          <rect x="260" y="150" width="40" height="20" rx="4" fill="var(--bg-primary)" stroke="#f97316" strokeWidth="1"/>
          <text x="280" y="164" fill="#f97316" fontSize="12" fontWeight="bold" textAnchor="middle">D−</text>

          <rect x="205" y="88" width="45" height="20" rx="4" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="1"/>
          <text x="227" y="102" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">Vdiff</text>

        </svg>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '85%', lineHeight: '1.5' }}>
        <strong style={{ color: 'var(--text-primary)' }}>Perfect Phase Alignment:</strong> The D+ and D− signals cross exactly at the 0V common-mode reference point. Vdiff is interpreted at the receiver as the absolute difference between the two traces at any given time.
      </p>
    </div>
  );
};

export default DiffWaveformVisualizer;
