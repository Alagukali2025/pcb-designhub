import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, Circle, Info, HelpCircle, TriangleAlert } from 'lucide-react';

const EMIChecklist = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const categories = [
    {
      id: "layout",
      title: "1. Layout & Topology",
      items: [
        { id: "loop_area", text: "Minimize critical current loop areas (SMPS hot-loops < 1 cm²).", severity: "critical" },
        { id: "return_path", text: "Ensure a continuous, un-split reference plane under every high-speed trace.", severity: "critical" },
        { id: "proximity", text: "Group noisy power components away from sensitive analog/RF zones.", severity: "high" },
        { id: "trace_length", text: "Keep high-frequency clock traces as short as possible.", severity: "high" }
      ]
    },
    {
      id: "grounding",
      title: "2. Grounding & Referencing",
      items: [
        { id: "unified_gnd", text: "Use a single, unified ground plane (avoid separate 'analog' and 'digital' grounds).", severity: "critical" },
        { id: "stitching", text: "Place GND stitching vias at every layer transition for high-speed signals.", severity: "high" },
        { id: "edge_keepout", text: "Maintain 20H edge-to-plane keepout to minimize fringing fields.", severity: "medium" },
        { id: "chassis_gnd", text: "Clear separation between chassis ground and signal ground at the I/O.", severity: "high" }
      ]
    },
    {
      id: "shielding",
      title: "3. Shielding & Isolation",
      items: [
        { id: "connector_shield", text: "Use 360° circular termination for cable shields (avoid pigtails).", severity: "critical" },
        { id: "can_mounting", text: "Include GND pads for RF shields / Faraday cages around sensitive circuits.", severity: "medium" },
        { id: "slot_antenna", text: "Avoid long slots in ground planes that act as resonant antennas.", severity: "high" }
      ]
    },
    {
      id: "filtering",
      title: "4. Filtering & Suppression",
      items: [
        { id: "decoupling", text: "Multi-tier decoupling (100nF, 10nF, 1nF) closest to IC power pins.", severity: "high" },
        { id: "ferrite_beads", text: "Add ferrite beads on all I/O lines crossing the board boundary.", severity: "high" },
        { id: "cm_choke", text: "Include common-mode chokes on differential power/data lines (USB, Ethernet).", severity: "high" },
        { id: "esd_protection", text: "TVS diodes placed at the very entry point of the connector.", severity: "critical" }
      ]
    }
  ];

  const toggleItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityColor = (sev) => {
    switch(sev) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      default: return '#378ADD';
    }
  };

  return (
    <div className="si-tool-card fade-in">
      <div className="si-tool-header">
        <div className="si-tool-icon-box" style={{ background: 'rgba(55, 138, 221, 0.1)', color: '#378ADD' }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>EMI/EMC Design Compliance Checklist</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Systematic Risk Mitigation for Industrial Standards</p>
        </div>
      </div>

      <div className="si-tool-grid">
        {categories.map(cat => (
          <div key={cat.id} className="zdiff-panel" style={{ padding: 'var(--space-4)' }}>
            <h4 className="zdiff-panel-title" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: 'var(--space-4)' }}>{cat.title}</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {cat.items.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    cursor: 'pointer', 
                    padding: '8px', 
                    borderRadius: 'var(--radius-md)',
                    background: checkedItems[item.id] ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                    transition: 'all var(--transition-fast) ease-in-out'
                  }}
                >
                  <div style={{ marginTop: '2px', color: checkedItems[item.id] ? 'var(--success)' : 'var(--text-tertiary)' }}>
                    {checkedItems[item.id] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: checkedItems[item.id] ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: checkedItems[item.id] ? 'line-through' : 'none', lineHeight: '1.4' }}>
                      {item.text}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.6rem', color: getSeverityColor(item.severity), textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>{item.severity}</span>
                      {item.severity === 'critical' && <ShieldAlert size={10} style={{ color: '#EF4444' }} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="zdiff-verdict zdiff-verdict--warn" style={{ marginTop: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ color: '#F59E0B' }}><TriangleAlert size={20} /></div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Regulatory Compliance Warning</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Failing 'Critical' items typically results in &gt;10dB overshoot in CISPR testing.</div>
          </div>
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
          J-STD-001 Compliant Audit
        </div>
      </div>
    </div>
  );
};

export default EMIChecklist;
