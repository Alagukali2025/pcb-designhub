import { Lock, Cpu, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ToolLock({ toolName = "Engineering Tool" }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="tool-lock-container slide-up">
      <div className="tool-lock-content glass-morphism">
        <div className="lock-icon-wrapper">
          <Lock className="lock-svg" size={32} />
          <div className="lock-ring"></div>
        </div>
        
        <div className="lock-text">
          <h3>Locked Component</h3>
          <p>Login to unlock the <strong>{toolName}</strong> and access professional PCB design models.</p>
        </div>

        <button 
          className="unlock-btn"
          onClick={() => navigate('/login', { state: { from: location } })}
        >
          <ShieldCheck size={18} />
          INITIALIZE SECURE LOGIN
        </button>


        <div className="lock-footer">
          <div className="lock-meta">
            <Cpu size={14} />
            <span>IPC-7351 / 2221B Standards Engine</span>
          </div>
        </div>
      </div>
      
      <div className="tool-lock-background">
        <div className="lock-mesh"></div>
      </div>
    </div>
  );
}
