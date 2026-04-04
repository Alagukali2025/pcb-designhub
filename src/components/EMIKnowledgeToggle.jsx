import { BookOpen, Zap, ShieldCheck, Layers } from 'lucide-react';

export default function EMIKnowledgeToggle({ currentLevels = [], onLevelChange }) {
  const levels = [
    { id: 'beginner', label: 'Beginner', icon: BookOpen },
    { id: 'intermediate', label: 'Intermediate', icon: Zap },
    { id: 'expert', label: 'Expert', icon: ShieldCheck }
  ];

  const toggleLevel = (id) => {
    if (currentLevels.includes(id)) {
      if (currentLevels.length > 1) {
        onLevelChange(currentLevels.filter(l => l !== id));
      }
    } else {
      onLevelChange([...currentLevels, id]);
    }
  };

  const selectAll = () => {
    onLevelChange(['beginner', 'intermediate', 'expert']);
  };

  const isAllSelected = currentLevels.length === 3;

  return (
    <div className="knowledge-toggle-container fade-in">
      <div className="toggle-header">
        <div className="toggle-label">Knowledge Complexity:</div>
        <button 
          className={`select-all-btn ${isAllSelected ? 'active' : ''}`}
          onClick={selectAll}
        >
          <Layers size={10} />
          {isAllSelected ? 'All Active' : 'Select All'}
        </button>
      </div>
      <div className="toggle-group">
        {levels.map((level) => {
          const Icon = level.icon;
          const isActive = currentLevels.includes(level.id);
          return (
            <button
              key={level.id}
              onClick={() => toggleLevel(level.id)}
              className={`toggle-btn ${isActive ? `active-${level.id}` : ''}`}
            >
              <Icon size={14} />
              <span>{level.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
