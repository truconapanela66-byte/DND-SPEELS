import { useState } from 'react';
import './CharacterCreator.css';
import StepBasicInfo from './steps/StepBasicInfo';
import StepAbilities from './steps/StepAbilities';
import StepSkills from './steps/StepSkills';
import StepEquipment from './steps/StepEquipment';
import CharacterSheet from './CharacterSheet';

const CharacterCreator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [character, setCharacter] = useState({
    name: '',
    race: null,
    class: null,
    alignment: null,
    abilities: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    },
    skills: [],
    equipment: [],
    background: '',
  });
  const [isReview, setIsReview] = useState(false);

  const steps = [
    { title: 'Informações Básicas', component: StepBasicInfo },
    { title: 'Habilidades', component: StepAbilities },
    { title: 'Perícias', component: StepSkills },
    { title: 'Equipamento', component: StepEquipment },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsReview(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCharacterUpdate = (updates) => {
    setCharacter((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleReset = () => {
    setCharacter({
      name: '',
      race: null,
      class: null,
      alignment: null,
      abilities: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      },
      skills: [],
      equipment: [],
      background: '',
    });
    setCurrentStep(0);
    setIsReview(false);
  };

  if (isReview) {
    return (
      <div className="character-creator-container">
        <CharacterSheet character={character} />
        <div className="button-group">
          <button 
            className="btn btn-secondary"
            onClick={() => setIsReview(false)}
          >
            ← Voltar para Edição
          </button>
          <button 
            className="btn btn-success"
            onClick={handleReset}
          >
            Criar Novo Personagem
          </button>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="character-creator-container">
      <header className="creator-header">
        <h1>🗡️ Criador de Personagem D&D</h1>
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
              onClick={() => index <= currentStep && setCurrentStep(index)}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="creator-content">
        <div className="step-container">
          <CurrentStepComponent 
            character={character}
            onUpdate={handleCharacterUpdate}
          />
        </div>
      </main>

      <footer className="creator-footer">
        <div className="button-group">
          <button 
            className="btn btn-secondary"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            ← Anterior
          </button>
          <span className="step-counter">
            Passo {currentStep + 1} de {steps.length}
          </span>
          <button 
            className="btn btn-primary"
            onClick={handleNextStep}
          >
            {currentStep === steps.length - 1 ? 'Revisar →' : 'Próximo →'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CharacterCreator;
