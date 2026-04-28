import './CharacterSheet.css';

const CharacterSheet = ({ character }) => {
  const abilityLabels = {
    str: { full: 'Força', short: 'FOR' },
    dex: { full: 'Destreza', short: 'DES' },
    con: { full: 'Constituição', short: 'CON' },
    int: { full: 'Inteligência', short: 'INT' },
    wis: { full: 'Sabedoria', short: 'SAB' },
    cha: { full: 'Carisma', short: 'CAR' },
  };

  const getModifier = (value) => {
    const modifier = Math.floor((value - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <div className="character-sheet">
      <div className="sheet-header">
        <h1 className="character-name">{character.name || 'Personagem sem Nome'}</h1>
      </div>

      <div className="sheet-content">
        {/* Basic Info */}
        <section className="sheet-section basic-info">
          <h2>Informações</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Raça:</span>
              <span className="value">{character.race?.name || 'Não definida'}</span>
            </div>
            <div className="info-item">
              <span className="label">Classe:</span>
              <span className="value">{character.class?.name || 'Não definida'}</span>
            </div>
            <div className="info-item">
              <span className="label">Alinhamento:</span>
              <span className="value">{character.alignment?.name || 'Não definido'}</span>
            </div>
          </div>
        </section>

        {/* Abilities */}
        <section className="sheet-section abilities-section">
          <h2>Habilidades de Atributo</h2>
          <div className="abilities-display">
            {Object.entries(character.abilities).map(([ability, value]) => (
              <div key={ability} className="ability-display">
                <div className="ability-score">
                  <span className="score-value">{value}</span>
                </div>
                <div className="ability-info">
                  <span className="ability-short">{abilityLabels[ability].short}</span>
                  <span className="ability-mod">{getModifier(value)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Background */}
        {character.background && (
          <section className="sheet-section background-section">
            <h2>História</h2>
            <p className="background-text">{character.background}</p>
          </section>
        )}

        {/* Skills */}
        {character.skills && character.skills.length > 0 && (
          <section className="sheet-section skills-section">
            <h2>Perícias ({character.skills.length})</h2>
            <div className="skills-display">
              {character.skills.map((skill) => (
                <div key={skill.index} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  {skill.ability_score && (
                    <span className="skill-ability">({skill.ability_score.name})</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Equipment */}
        {character.equipment && character.equipment.length > 0 && (
          <section className="sheet-section equipment-section">
            <h2>Equipamento ({character.equipment.length})</h2>
            <div className="equipment-display">
              {character.equipment.map((item) => (
                <div key={item.index} className="equipment-item">
                  {item.name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Print Hint */}
      <div className="print-hint">
        💡 Você pode imprimir esta ficha usando Ctrl+P ou Cmd+P
      </div>
    </div>
  );
};

export default CharacterSheet;
