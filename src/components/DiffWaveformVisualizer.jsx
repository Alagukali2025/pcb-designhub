import React, { useState } from 'react';

const DiffWaveformVisualizer = () => {
  const [skew, setSkew] = useState(0); // Skew value in pixels

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
      
      {/* Interactive Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '400px', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Zero Skew</span>
        <input 
          type="range" 
          min="-20" 
          max="20" 
          value={skew} 
          onChange={(e) => setSkew(parseInt(e.target.value))} 
          style={{ 
            flex: 1,
            accentColor: 'var(--accent-primary)',
            height: '6px',
            borderRadius: '3px',
            background: 'var(--border-color)'
          }}
        />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>High Skew</span>
        <span style={{ 
          padding: '2px 6px', 
          background: skew === 0 ? 'var(--success)' : 'var(--danger)', 
          color: '#fff', 
          borderRadius: '4px', 
          fontSize: '0.75rem',
          fontWeight: 700,
          minWidth: '40px',
          textAlign: 'center'
        }}>
          {skew === 0 ? 'OK' : `${Math.abs(skew * 2)}ps`}
        </span>
      </div>

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
          <g transform={`translate(${skew}, 0)`} style={{ transition: 'transform 0.1s ease-out' }}>
            <path d="M 50 100 Q 100 20, 150 100 T 250 100 T 350 100 T 450 100" fill="none" stroke="#3b82f6" strokeWidth="3" />
            <rect x="260" y="30" width="40" height="20" rx="4" fill="var(--bg-primary)" stroke="#3b82f6" strokeWidth="1"/>
            <text x="280" y="44" fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">D+</text>
          </g>
          
          {/* D- Waveform (Orange) */}
          <g transform={`translate(${-skew}, 0)`} style={{ transition: 'transform 0.1s ease-out' }}>
            <path d="M 50 100 Q 100 180, 150 100 T 250 100 T 350 100 T 450 100" fill="none" stroke="#f97316" strokeWidth="3" />
            <rect x="260" y="150" width="40" height="20" rx="4" fill="var(--bg-primary)" stroke="#f97316" strokeWidth="1"/>
            <text x="280" y="164" fill="#f97316" fontSize="12" fontWeight="bold" textAnchor="middle">D−</text>
          </g>

          {/* Static Vdiff Indication (Only shown when no skew or near center) */}
          {Math.abs(skew) < 5 && (
            <g>
              <line x1="200" y1="20" x2="200" y2="180" stroke="var(--text-tertiary)" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 195 25 L 200 20 L 205 25" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" />
              <path d="M 195 175 L 200 180 L 205 175" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" />
              <rect x="205" y="88" width="45" height="20" rx="4" fill="var(--bg-primary)" stroke="var(--border-color)" strokeWidth="1"/>
              <text x="227" y="102" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">Vdiff</text>
            </g>
          )}

          {/* Skew Warning Indicator */}
          {Math.abs(skew) >= 5 && (
            <g transform={`translate(${200}, 90)`}>
              <rect x="-50" y="-15" width="100" height="30" rx="4" fill="var(--bg-primary)" stroke="var(--danger)" strokeWidth="1"/>
              <text x="0" y="4" fill="var(--danger)" fontSize="10" fontWeight="bold" textAnchor="middle">Mode Conversion</text>
            </g>
          )}

        </svg>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '85%', lineHeight: '1.5' }}>
        {skew === 0 ? (
          <>
            <strong style={{ color: 'var(--success)' }}>Perfect Phase Alignment:</strong> The D+ and D− signals cross exactly at the 0V common-mode reference point. Vdiff is interpreted at the receiver as the absolute difference between the two traces.
          </>
        ) : (
          <>
            <strong style={{ color: 'var(--danger)' }}>Phase Skew Present ({Math.abs(skew * 2)} ps):</strong> The signals are misaligned. This converts the differential signal into common-mode noise, degrading CMRR and shrinking the data eye.
          </>
        )}
      </p>
    </div>
  );
};

export default DiffWaveformVisualizer;
