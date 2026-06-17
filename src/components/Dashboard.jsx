import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ChevronRight, BookOpen, Cpu } from 'lucide-react';
import RoadMap from './RoadMap';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';

// Build a title lookup map for prerequisites display
const moduleTitleMap = modulesData.reduce((acc, m) => {
  acc[m.id] = m.title;
  return acc;
}, {});

// Derive which phase a module belongs to
const modulePhaseMap = {
  'footprint': 'Library',
  'stackup': 'Stackup',
  'thermal': 'Stackup',
  'high_speed': 'Routing',
  'diff_pair': 'Routing',
  'ddr': 'Routing',
  'si_pi': 'Routing',
  'rf_design': 'Routing',
  'flex_hdi_routing': 'Routing',
  'emi_emc': 'DFM',
  'dfm_dft': 'DFM',
  'pcb_output_system': 'Output'
};

// Phase accent colours (CSS vars won't work in JS objects, so use raw values)
const phaseAccentMap = {
  'Library':  { color: '#c87533', bg: 'rgba(200,117,51,0.12)',  border: 'rgba(200,117,51,0.3)'  },
  'Stackup':  { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',   border: 'rgba(14,165,233,0.25)' },
  'Routing':  { color: '#1a6b3a', bg: 'rgba(26,107,58,0.12)',   border: 'rgba(26,107,58,0.3)'   },
  'DFM':      { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.25)'  },
  'Output':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)' }
};

export default function Dashboard() {
  const { activePhase, setActivePhase } = useDesign();
  const { userData } = useAuth();
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    return !sessionStorage.getItem('dashboard_animated');
  });

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        sessionStorage.setItem('dashboard_animated', 'true');
        // We don't necessarily need to set shouldAnimate to false here
        // as the component will re-render or the user will navigate.
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  // Mapping flow phase to module IDs
  const phaseToModules = {
    'Library': ['footprint'],
    'Stackup': ['stackup', 'thermal'],
    'Routing': ['high_speed', 'diff_pair', 'ddr', 'si_pi', 'rf_design', 'flex_hdi_routing'],
    'DFM': ['emi_emc', 'dfm_dft'],
    'Output': ['pcb_output_system']
  };

  // Filter modules based on active phase (if null, show all)
  const filteredModules = activePhase 
    ? modulesData.filter(mod => phaseToModules[activePhase]?.includes(mod.id))
    : modulesData;

  return (
    <div className="dashboard-container fade-in">

      {/* ── Welcome Hero (item 3) ── */}
      <div className="dash-welcome-hero slide-up" style={{ animationDelay: '0ms' }}>
        <div className="dash-welcome-hero__icon">
          <Cpu size={22} />
        </div>
        <div className="dash-welcome-hero__text">
          <h1 className="dash-welcome-hero__heading">
            {userData?.name ? `Welcome back, ${userData.name.split(' ')[0]}.` : 'PCB Design Hub.'}
          </h1>
          <p className="dash-welcome-hero__tagline">
            Design it right.&nbsp;<span className="dash-hero-accent">Build it once.</span>
          </p>
        </div>
        <div className="dash-welcome-hero__pcb-trace" aria-hidden="true" />
      </div>

      <RoadMap activePhase={activePhase} onPhaseClick={setActivePhase} />

      <div className="modules-grid">
        {filteredModules.length > 0 ? (
          filteredModules.map((mod, i) => {
            const Icon = mod.icon;
            const prereqs = mod.prerequisites || [];
            // Derive phase badge for this module (item 5)
            const phase = modulePhaseMap[mod.id];
            const accent = phase ? phaseAccentMap[phase] : null;
            return (
              <Link 
                to={`/module/${mod.id}`} 
                key={mod.id} 
                className={`module-card ${shouldAnimate ? 'slide-up' : ''}`} 
                style={{
                  ...(shouldAnimate ? { animationDelay: `${i * 50}ms` } : {}),
                  ...(accent ? { '--card-phase-color': accent.color, '--card-phase-bg': accent.bg, '--card-phase-border': accent.border } : {})
                }}
              >
                <div className="card-top">
                  <div className="card-title-group">
                    <div className="icon-wrapper">
                      <Icon size={20} />
                    </div>
                    <div className="card-title-col">
                      {phase && (
                        <span className="module-phase-badge">{phase}</span>
                      )}
                      <h3>{mod.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <p>{mod.desc}</p>
                  {prereqs.length > 0 && (
                    <div className="module-prereq">
                      <BookOpen size={10} className="prereq-label" />
                      <span className="prereq-label">Requires:</span>
                      {prereqs.map(pid => (
                        <span key={pid} className="prereq-tag">
                          {moduleTitleMap[pid] || pid}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No modules available for this phase currently.</p>
          </div>
        )}
      </div>
    </div>
  );
}
