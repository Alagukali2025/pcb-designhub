import { useState, useMemo } from 'react';
import { Calculator, Zap, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function EMICalculator() {
  const [riseTime, setRiseTime] = useState(1); // ns
  const [unit, setUnit] = useState('ns');

  const stats = useMemo(() => {
    const tr = unit === 'ns' ? riseTime : riseTime / 1000;
    if (isNaN(tr) || tr <= 0) return null;

    // Significant Frequency (Harmonic Bandwidth)
    const fmax = 0.35 / tr; // GHz
    const fmaxMhz = fmax * 1000;

    // Wavelength in FR4 (Er ~ 4.3)
    const er = 4.3;
    const v = 300 / Math.sqrt(er); // mm/ns or speed in FR4 ~145 mm/ns
    const lambda = v / fmax; // mm

    return {
      fmax: fmaxMhz.toFixed(2),
      lambda: lambda.toFixed(2),
      criticalLength: (lambda / 20).toFixed(2), // Significant radiation start
      antennaLength: (lambda / 4).toFixed(2),  // Peak radiation (monopole resonance)
    };
  }, [riseTime, unit]);

  return (
    <div className="calculator-container slide-up">
      <div className="calculator-header">
        <div className="calc-title">
          <Calculator size={20} />
          <span>EMI Bandwidth & Critical Length Calculator</span>
        </div>
        <div className="calc-badge">Expert Tool</div>
      </div>

      <div className="calc-grid">
        <div className="calc-input-section">
          <div className="input-group">
            <label>Signal Rise/Fall Time (10-90%)</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={riseTime}
                onChange={(e) => setRiseTime(parseFloat(e.target.value) || 0)}
                step="0.1"
                min="0.01"
              />
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="ns">ns</option>
                <option value="ps">ps</option>
              </select>
            </div>
            <p className="input-hint">The faster the edge (lower Tr), the higher the frequency bandwidth.</p>
          </div>
        </div>

        <div className="calc-result-section">
          {stats ? (
            <div className="results-grid-mini">
              <div className="result-card-mini accent-blue">
                <span className="res-label">Significant Frequency (f<sub>max</sub>)</span>
                <span className="res-value">{stats.fmax} <small>MHz</small></span>
                <span className="res-note">Harmonic energy boundary</span>
              </div>
              <div className="result-card-mini accent-orange">
                <span className="res-label">Critical Length (λ/20)</span>
                <span className="res-value">{stats.criticalLength} <small>mm</small></span>
                <span className="res-note">Traces longer than this radiate</span>
              </div>
              <div className="result-card-mini accent-red">
                <span className="res-label">Resonant Length (λ/4)</span>
                <span className="res-value">{stats.antennaLength} <small>mm</small></span>
                <span className="res-note">Peak antenna efficiency</span>
              </div>
            </div>
          ) : (
            <div className="calc-error">Enter a valid rise time to calculate results.</div>
          )}
        </div>
      </div>

      <div className="calc-info-box">
        <div className="info-icon"><Zap size={20} /></div>
        <div className="info-text">
          <strong>The 0.35/Tr Rule:</strong> High-speed design is governed by <em>Edge Rate</em>, not clock frequency. Even a 1 MHz clock with a 1 ns rise time creates spectral energy up to 350 MHz, requiring high-frequency design tactics.
        </div>
      </div>

      {stats && parseFloat(stats.fmax) > 1000 && (
        <div className="alert alert-danger mt-4">
          <div className="alert-icon"><ShieldAlert size={24} /></div>
          <div className="alert-content">
            <strong>Gigahertz Domain detected:</strong> At {stats.fmax} MHz, fiber weave skew and via stubs become first-order effects. Standard FR-4 is likely insufficient; consider Low-Loss laminates.
          </div>
        </div>
      )}
    </div>
  );
}
