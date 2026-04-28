import { useState, useEffect } from 'react';
import { fetchSkills } from '../../services/dndApi';
import { useFetch } from '../../hooks/useFetch';
import './StepSkills.css';

const StepSkills = ({ character, onUpdate }) => {
  const { data: skillsData, loading, error } = useFetch(fetchSkills);
  const [availableSkills, setAvailableSkills] = useState([]);

  useEffect(() => {
    if (skillsData && skillsData.results) {
      setAvailableSkills(skillsData.results);
    }
  }, [skillsData]);

  const handleSkillToggle = (skill) => {
    const isSelected = character.skills.some(s => s.index === skill.index);
    if (isSelected) {
      onUpdate({
        skills: character.skills.filter(s => s.index !== skill.index),
      });
    } else {
      onUpdate({
        skills: [...character.skills, skill],
      });
    }
  };

  if (loading) {
    return <div className="step-loading">Carregando perícias...</div>;
  }

  if (error) {
    return <div className="step-error">Erro ao carregar perícias: {error}</div>;
  }

  const skillsByAbility = {};
  availableSkills.forEach(skill => {
    const abilityIndex = skill.ability_score?.index || 'unknown';
    if (!skillsByAbility[abilityIndex]) {
      skillsByAbility[abilityIndex] = [];
    }
    skillsByAbility[abilityIndex].push(skill);
  });

  const abilityNames = {
    str: 'Força',
    dex: 'Destreza',
    con: 'Constituição',
    int: 'Inteligência',
    wis: 'Sabedoria',
    cha: 'Carisma',
  };

  return (
    <div className="step-skills">
      <div className="skills-container">
        <h2>Perícias</h2>
        <p className="subtitle">
          Selecione as perícias que seu personagem domina
        </p>

        <div className="skills-info">
          <p>
            Perícias representam treino especializado em áreas específicas. Cada perícia está
            associada a uma habilidade de atributo que fornecerá modificadores adicionais.
          </p>
        </div>

        <div className="skills-by-ability">
          {Object.entries(skillsByAbility).map(([abilityIndex, skills]) => (
            <div key={abilityIndex} className="ability-skills-group">
              <h3 className="ability-skills-title">
                {abilityNames[abilityIndex] || abilityIndex.toUpperCase()}
              </h3>

              <div className="skills-list">
                {skills.map((skill) => {
                  const isSelected = character.skills.some(s => s.index === skill.index);
                  return (
                    <label key={skill.index} className="skill-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSkillToggle(skill)}
                        className="skill-input"
                      />
                      <span className="skill-label">
                        <span className="skill-name">{skill.name}</span>
                        {skill.desc && skill.desc.length > 0 && (
                          <span className="skill-description">{skill.desc[0]}</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="skills-summary">
          <h3>Perícias Selecionadas ({character.skills.length})</h3>
          {character.skills.length > 0 ? (
            <ul className="selected-skills-list">
              {character.skills.map((skill) => (
                <li key={skill.index}>
                  <span className="selected-skill-name">{skill.name}</span>
                  <button
                    onClick={() => handleSkillToggle(skill)}
                    className="remove-skill-btn"
                    title="Remover perícia"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-skills">Nenhuma perícia selecionada ainda</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepSkills;
