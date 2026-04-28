import { useState, useEffect } from 'react';
import { fetchRaces, fetchClasses, fetchAlignments } from '../../services/dndApi';
import { useFetch } from '../../hooks/useFetch';
import './StepBasicInfo.css';

const StepBasicInfo = ({ character, onUpdate }) => {
  const { data: racesData, loading: racesLoading, error: racesError } = useFetch(fetchRaces);
  const { data: classesData, loading: classesLoading, error: classesError } = useFetch(fetchClasses);
  const { data: alignmentsData, loading: alignmentsLoading, error: alignmentsError } = useFetch(fetchAlignments);

  const [raceDetails, setRaceDetails] = useState(null);
  const [classDetails, setClassDetails] = useState(null);

  const handleNameChange = (e) => {
    onUpdate({ name: e.target.value });
  };

  const handleRaceChange = async (e) => {
    const raceIndex = e.target.value;
    if (raceIndex) {
      const races = racesData?.results || [];
      const race = races.find(r => r.index === raceIndex);
      onUpdate({ race });
      setRaceDetails(race);
    }
  };

  const handleClassChange = async (e) => {
    const classIndex = e.target.value;
    if (classIndex) {
      const classes = classesData?.results || [];
      const cls = classes.find(c => c.index === classIndex);
      onUpdate({ class: cls });
      setClassDetails(cls);
    }
  };

  const handleAlignmentChange = (e) => {
    const alignmentIndex = e.target.value;
    if (alignmentIndex) {
      const alignments = alignmentsData?.results || [];
      const alignment = alignments.find(a => a.index === alignmentIndex);
      onUpdate({ alignment });
    }
  };

  const handleBackgroundChange = (e) => {
    onUpdate({ background: e.target.value });
  };

  if (racesLoading || classesLoading || alignmentsLoading) {
    return <div className="step-loading">Carregando dados...</div>;
  }

  if (racesError || classesError || alignmentsError) {
    return (
      <div className="step-error">
        Erro ao carregar dados: {racesError || classesError || alignmentsError}
      </div>
    );
  }

  const races = racesData?.results || [];
  const classes = classesData?.results || [];
  const alignments = alignmentsData?.results || [];

  return (
    <div className="step-basic-info">
      <div className="form-section">
        <h2>Informações Básicas do Personagem</h2>

        <div className="form-group">
          <label htmlFor="name">Nome do Personagem</label>
          <input
            id="name"
            type="text"
            placeholder="Ex: Aragorn, Gandalf, Legolas"
            value={character.name}
            onChange={handleNameChange}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="race">Raça</label>
            <select
              id="race"
              value={character.race?.index || ''}
              onChange={handleRaceChange}
              className="form-select"
            >
              <option value="">Selecione uma raça</option>
              {races.map((race) => (
                <option key={race.index} value={race.index}>
                  {race.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="class">Classe</label>
            <select
              id="class"
              value={character.class?.index || ''}
              onChange={handleClassChange}
              className="form-select"
            >
              <option value="">Selecione uma classe</option>
              {classes.map((cls) => (
                <option key={cls.index} value={cls.index}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="alignment">Alinhamento</label>
            <select
              id="alignment"
              value={character.alignment?.index || ''}
              onChange={handleAlignmentChange}
              className="form-select"
            >
              <option value="">Selecione um alinhamento</option>
              {alignments.map((alignment) => (
                <option key={alignment.index} value={alignment.index}>
                  {alignment.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="background">História/Background</label>
          <textarea
            id="background"
            placeholder="Conte a história do seu personagem..."
            value={character.background}
            onChange={handleBackgroundChange}
            className="form-textarea"
            rows="4"
          />
        </div>

        {character.race && (
          <div className="info-card race-info">
            <h3>Raça: {character.race.name}</h3>
            <p><strong>Velocidade:</strong> {character.race.speed} m</p>
            {character.race.ability_bonuses && character.race.ability_bonuses.length > 0 && (
              <div>
                <strong>Bônus de Habilidades:</strong>
                <ul>
                  {character.race.ability_bonuses.map((bonus, idx) => (
                    <li key={idx}>
                      {bonus.ability_score.name}: +{bonus.bonus}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {character.class && (
          <div className="info-card class-info">
            <h3>Classe: {character.class.name}</h3>
            <p>{character.class.name} é uma classe versátil com muitas possibilidades.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepBasicInfo;
