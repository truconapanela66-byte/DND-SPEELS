import { useState } from 'react';
import './StepAbilities.css';

const StepAbilities = ({ character, onUpdate }) => {
  const abilityLabels = {
    str: { full: 'Força', description: 'Força bruta e poder físico' },
    dex: { full: 'Destreza', description: 'Agilidade e reflexos' },
    con: { full: 'Constituição', description: 'Resistência e vitalidade' },
    int: { full: 'Inteligência', description: 'Raciocínio e memória' },
    wis: { full: 'Sabedoria', description: 'Percepção e intuição' },
    cha: { full: 'Carisma', description: 'Personalidade e influência' },
  };

  const handleAbilityChange = (ability, value) => {
    const numValue = Math.max(3, Math.min(20, parseInt(value) || 10));
    onUpdate({
      abilities: {
        ...character.abilities,
        [ability]: numValue,
      },
    });
  };

  const getModifier = (value) => {
    const modifier = Math.floor((value - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const calculateTotalModifier = () => {
    const values = Object.values(character.abilities);
    const total = values.reduce((sum, val) => sum + Math.floor((val - 10) / 2), 0);
    return total;
  };

  return (
    <div className="step-abilities">
      <div className="abilities-container">
        <h2>Habilidades de Atributo</h2>
        <p className="subtitle">
          Ajuste as seis habilidades principais do seu personagem (de 3 a 20)
        </p>

        <div className="abilities-grid">
          {Object.entries(character.abilities).map(([ability, value]) => (
            <div key={ability} className="ability-card">
              <div className="ability-header">
                <h3>{abilityLabels[ability].full}</h3>
                <span className="ability-abbreviation">{ability.toUpperCase()}</span>
              </div>

              <p className="ability-description">{abilityLabels[ability].description}</p>

              <div className="ability-input-group">
                <button
                  onClick={() => handleAbilityChange(ability, value - 1)}
                  disabled={value <= 3}
                  className="ability-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={value}
                  onChange={(e) => handleAbilityChange(ability, e.target.value)}
                  className="ability-input"
                />
                <button
                  onClick={() => handleAbilityChange(ability, value + 1)}
                  disabled={value >= 20}
                  className="ability-btn"
                >
                  +
                </button>
              </div>

              <div className="ability-modifier">
                <span className="modifier-label">Modificador:</span>
                <span className={`modifier-value ${getModifier(value).startsWith('+') ? 'positive' : 'negative'}`}>
                  {getModifier(value)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="abilities-summary">
          <h3>Resumo</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total de Modificadores:</span>
              <span className="summary-value">{calculateTotalModifier()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pontuação Total:</span>
              <span className="summary-value">
                {Object.values(character.abilities).reduce((sum, val) => sum + val, 0)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Habilidade Mais Alta:</span>
              <span className="summary-value">
                {Math.max(...Object.values(character.abilities))}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Habilidade Mais Baixa:</span>
              <span className="summary-value">
                {Math.min(...Object.values(character.abilities))}
              </span>
            </div>
          </div>
        </div>

        <div className="info-box">
          <h4>💡 Dica sobre Habilidades</h4>
          <p>
            As habilidades variam de 3 a 20. A pontuação padrão é 10 (modificador +0).
            Cada ponto acima de 10 melhora o modificador. Ajuste as habilidades de acordo com o conceito
            do seu personagem: Força para guerreiros, Destreza para acrobatas, Inteligência para magos, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepAbilities;
