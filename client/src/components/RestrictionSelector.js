import React, { useState } from 'react';
import './RestrictionSelector.css';

const commonRestrictions = [
  { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { id: 'tree-nuts', label: 'Tree Nuts', icon: '🌰' },
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'soy', label: 'Soy', icon: '🫘' },
  { id: 'wheat', label: 'Wheat/Gluten', icon: '🌾' },
  { id: 'fish', label: 'Fish', icon: '🐟' },
  { id: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { id: 'red-dye', label: 'Red Dye 40', icon: '🔴' },
  { id: 'yellow-dye', label: 'Yellow Dye 5', icon: '🟡' },
  { id: 'artificial-colors', label: 'Artificial Colors', icon: '🎨' },
  { id: 'msg', label: 'MSG', icon: '🧂' },
];

function RestrictionSelector({ restrictions, onRestrictionsChange }) {
  const [customRestriction, setCustomRestriction] = useState('');

  const toggleRestriction = (restrictionId) => {
    if (restrictions.includes(restrictionId)) {
      onRestrictionsChange(restrictions.filter(r => r !== restrictionId));
    } else {
      onRestrictionsChange([...restrictions, restrictionId]);
    }
  };

  const addCustomRestriction = () => {
    if (customRestriction.trim() && !restrictions.includes(customRestriction.trim())) {
      onRestrictionsChange([...restrictions, customRestriction.trim()]);
      setCustomRestriction('');
    }
  };

  const removeRestriction = (restriction) => {
    onRestrictionsChange(restrictions.filter(r => r !== restriction));
  };

  return (
    <div className="restriction-selector">
      <h2>Select Your Dietary Restrictions</h2>
      
      <div className="restriction-grid">
        {commonRestrictions.map(restriction => (
          <button
            key={restriction.id}
            className={`restriction-btn ${restrictions.includes(restriction.id) ? 'selected' : ''}`}
            onClick={() => toggleRestriction(restriction.id)}
          >
            <span className="icon">{restriction.icon}</span>
            <span className="label">{restriction.label}</span>
          </button>
        ))}
      </div>

      <div className="custom-restriction">
        <input
          type="text"
          placeholder="Add custom restriction..."
          value={customRestriction}
          onChange={(e) => setCustomRestriction(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomRestriction()}
        />
        <button onClick={addCustomRestriction}>Add</button>
      </div>

      {restrictions.length > 0 && (
        <div className="selected-restrictions">
          <h3>Your Restrictions:</h3>
          <div className="restriction-tags">
            {restrictions.map(restriction => (
              <span key={restriction} className="restriction-tag">
                {restriction}
                <button onClick={() => removeRestriction(restriction)}>×</button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RestrictionSelector;
